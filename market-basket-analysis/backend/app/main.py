from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_router import api_router
import os

app = FastAPI(title="Market Basket Analysis API", version="1.0.0")

# CORS configuration for both development and production
allowed_origins = [
    # Development URLs
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "http://localhost:3000",  # Docker development
    # Production frontend URLs
    "https://market-basket-frontend.vercel.app",
    "https://market-basket-frontend-drbxv68lu-amreenkhan-1410s-projects.vercel.app",
]

# Add production URLs from environment variables
production_frontend_url = os.getenv("PRODUCTION_FRONTEND_URL")
if production_frontend_url:
    allowed_origins.append(production_frontend_url)

# Allow all origins in development mode
if os.getenv("DEBUG", "False").lower() == "true":
    allowed_origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://market-basket-frontend(?:-[a-z0-9-]+)?\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Market Basket Analysis API"}
