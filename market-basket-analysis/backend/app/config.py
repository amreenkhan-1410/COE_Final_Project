from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Market Basket Analysis"
    debug: bool = True
    # Add other settings

settings = Settings()