Here's the full `README.md` content in Markdown format:


# 🔁 Website Cloner & Gemini HTML Generator

This project is a full-stack web application that lets users **clone any public website** and generate a **visually similar version using Google's Gemini AI**. Users can preview the scraped and AI-generated versions side by side and **download the code as a ZIP file**.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (TypeScript)
- **Backend**: FastAPI (Python)
- **AI Model**: Gemini 2.0 Flash (via Google Generative AI API)
- **Headless Scraping**: BeautifulSoup, Requests
- **Other Tools**: CORS Middleware, `uv` package manager

---

## 📦 Features

- ✅ Scrapes website DOM and inlines styles for cleaner visualization
- ✅ Uses Gemini to reconstruct a standalone HTML version with inline CSS
- ✅ Shows both raw and Gemini-transformed previews in fullscreen
- ✅ Allows user to **download a ZIP** of the generated HTML/CSS files
- ✅ Single loader for entire operation with toast notifications

---

## ⚙️ Installation & Setup

### Backend

> ⚠️ Requires Python 3.9+ and `uv` package manager

1. Clone the repo and navigate to the backend directory
2. Install dependencies:

```bash
uv sync
````

3. Add your Google Gemini API key to a `.env` file:

```env
GEMINI_API_KEY=your_google_api_key_here
```

4. Run the backend server:

```bash
uv run fastapi dev
```

The backend will be available at `http://localhost:8000`.

---

### Frontend

> Requires Node.js 18+

1. Navigate to the frontend directory
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

---

## 🚀 How It Works

1. User enters a public URL into the frontend.
2. On clicking "Clone":

   * Backend scrapes the HTML, CSS, and replaces images with placeholders
   * Inlines styles and extracts key layout components
   * Sends a prompt to Gemini to generate a reconstructed version using inline CSS
3. Both the **scraped** and **Gemini-generated** versions are returned and shown in side-by-side iframes.
4. A downloadable ZIP file containing the files is also generated.

---

## 📂 Project Structure

```
backend/
  ├── app/
  │   └── scraper.py       # Handles scraping + Gemini prompt logic
  ├── main.py              # FastAPI routes
  ├── scraped_output/      # Stores generated HTML/CSS files and zip
  └── .env                 # Contains GEMINI_API_KEY

frontend/
  ├── components/          # Reusable UI components
  ├── pages/index.tsx      # Main app logic
  └── public/              # Static assets
```

---

## 📝 Notes

* If a site uses **TailwindCSS**, the scraped version may look minimal (due to utility class loss). Gemini attempts to reconstruct the design using inline styles.
* All images are replaced with a dummy placeholder.
* For best results, use URLs with clearly defined layout structures.

---

## 📥 Future Improvements

* Session-specific ZIP generation for multiple users
* Streaming Gemini responses with progress indicators
* Handling login-protected or JavaScript-heavy pages (via Playwright)

---

## 🧠 Made For

This project was built as a take-home challenge for the **Orchids SWE Internship**, showcasing web scraping, LLM integration, and full-stack architecture.

---

> Made with ❤️ using FastAPI, Gemini AI, and Next.js
