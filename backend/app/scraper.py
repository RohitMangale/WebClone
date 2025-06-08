import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin
import re
from dotenv import load_dotenv
from functools import lru_cache
import google.generativeai as genai

# Load API key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="gemini-2.0-flash")

DUMMY_IMAGE = "https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"
OUTPUT_DIR = "scraped_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@lru_cache(maxsize=50)
def scrape_full_website(url: str) -> None:
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Failed to fetch URL: {e}")
        return

    soup = BeautifulSoup(response.text, "html.parser")

    # Replace all images with dummy
    for img in soup.find_all("img"):
        img["src"] = DUMMY_IMAGE

    # Collect and inline CSS for Gemini, but keep raw CSS too
    css_blocks = []
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href")
        if href:
            css_url = urljoin(url, href)
            try:
                css_resp = requests.get(css_url, timeout=10)
                css_resp.raise_for_status()
                css = css_resp.text
                css_blocks.append(css)
                # Optional: inline for visual consistency
                style_tag = soup.new_tag("style")
                style_tag.string = css
                soup.head.append(style_tag)
                link.decompose()
            except requests.RequestException as e:
                print(f"⚠️ Could not fetch CSS: {css_url} — {e}")
                continue

    raw_html_full = str(soup)
    raw_css_combined = "\n".join(css_blocks)

    # Save scraped raw version
    with open(os.path.join(OUTPUT_DIR, "original.html"), "w", encoding="utf-8") as f:
        f.write(raw_html_full)
    with open(os.path.join(OUTPUT_DIR, "original_styles.css"), "w", encoding="utf-8") as f:
        f.write(raw_css_combined)

    # For Gemini: Select important layout sections only
    layout_parts = [
        soup.find("nav"),
        soup.find("header"),
        soup.find("main"),
        soup.find("footer")
    ]
    prompt_html = "".join(str(part) for part in layout_parts if part)[:10000]
    prompt_css = raw_css_combined[:10000]

    with open(os.path.join(OUTPUT_DIR, "prompt_html.html"), "w", encoding="utf-8") as f:
        f.write(prompt_html)
    with open(os.path.join(OUTPUT_DIR, "prompt_css.css"), "w", encoding="utf-8") as f:
        f.write(prompt_css)

    # Gemini Prompt
    prompt = f"""
    You are a frontend developer.

    Recreate a complete replica using the using html and CSS below .
    Make sure you use wverything properly
    - Use layout from the provided HTML.
    - Inline styles using the given CSS.
    - Replace all image `src` attributes with: {DUMMY_IMAGE}
    - Output a valid HTML page from <html> to </html>.

    HTML:
    ```html
    {prompt_html}
    {prompt_css}
    """

    try:
        response = model.generate_content(prompt)
        clean_html = re.sub(r"```html|```", "", response.text, flags=re.DOTALL).strip()

        if not clean_html.lower().startswith("<html"):
            clean_html = f"<html><body>{clean_html}</body></html>"

        with open(os.path.join(OUTPUT_DIR, "generated_by_gemini.html"), "w", encoding="utf-8") as f:
            f.write(clean_html)

        print("✅ Scraping complete. Files saved in scraped_output/")
    except Exception as e:
        print("🔥 Gemini Error:", e)
