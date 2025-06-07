import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin
import re
from dotenv import load_dotenv
from functools import lru_cache
import google.generativeai as genai

# Load Gemini API key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create Gemini model instance
model = genai.GenerativeModel(model_name="gemini-2.0-flash")

DUMMY_IMAGE = "https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"

@lru_cache(maxsize=50)
def scrape_website(url: str) -> str:
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        return f"<html><body><h1>Error fetching page</h1><p>{e}</p></body></html>"

    soup = BeautifulSoup(response.text, "html.parser")

    # Replace all images with dummy image
    for img in soup.find_all("img"):
        img["src"] = DUMMY_IMAGE

    # Inline CSS from external stylesheets
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href")
        if href:
            css_url = urljoin(url, href)
            try:
                css_resp = requests.get(css_url, timeout=10)
                css_resp.raise_for_status()
                css = css_resp.text
                style_tag = soup.new_tag("style")
                style_tag.string = css
                soup.head.append(style_tag)
                link.decompose()
            except requests.RequestException as e:
                print(f"⚠️ Could not fetch CSS: {css_url} — {e}")
                continue

    # Remove unwanted tags
    for tag in soup(["script", "iframe", "noscript", "style"]):
        tag.decompose()

    # Prioritize layout sections for prompt
    layout_parts = [
        soup.head,
        soup.find("nav"),
        soup.find("header"),
        soup.find("main"),
        soup.find("footer")
    ]
    html_sections = "".join(str(part) for part in layout_parts if part)
    # Truncate safely to 10,000 characters
    prompt_html = html_sections[:5000]

    prompt = f"""
    You are a frontend developer.

    Recreate a **complete** standalone HTML page using only inline CSS.

    - Preserve all layout elements like <nav>, <header>, <main>, <sidebar>, <footer>.
    - Use inline CSS styles only (no external or <style> blocks).
    - Replace all images by setting their src attribute to exactly: {DUMMY_IMAGE}
    - Do NOT add any placeholder texts like "Header" or "Sidebar" — only valid HTML.
    - Output a valid, complete HTML document starting with <html> and ending with </html>.

    Input HTML to base on:
    ```html
    {prompt_html}
    """

    try:
        response = model.generate_content(prompt)
        # Remove any markdown code block delimiters anywhere in the text
        clean_html = re.sub(r"```html|```", "", response.text, flags=re.DOTALL).strip()
        html = clean_html
        if not html.strip().lower().startswith("<html"):
            html = f"<html><body>{html}</body></html>"

        return clean_html
    except Exception as e:
        print("🔥 Gemini Error:", e)
        return f"<html><body><h1>Gemini Error</h1><p>{e}</p></body></html>"
