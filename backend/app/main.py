from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.scraper import scrape_full_website
import os

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = "scraped_output"

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/clone")
def clone_website(url: str = Query(...)):
    try:
        scrape_full_website(url)

        # Read the original (scraped) and Gemini-generated HTML from file
        with open(os.path.join(OUTPUT_DIR, "original.html"), "r", encoding="utf-8") as f:
            scraped_html = f.read()

        with open(os.path.join(OUTPUT_DIR, "generated_by_gemini.html"), "r", encoding="utf-8") as f:
            gemini_html = f.read()

        return JSONResponse(content={
            "scraped_html": scraped_html,
            "gemini_html": gemini_html
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
