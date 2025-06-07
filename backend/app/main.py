from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from app.scraper import scrape_website


app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/clone")
def clone_website(url: str = Query(...)):
    html = scrape_website(url)
    return {"cloned_html": html}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
