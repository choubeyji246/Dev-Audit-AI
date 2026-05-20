from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    PORT: int = 8000
    
    class Config:
        env_file = ".env"

# Instantiate configuration properties object
settings = Settings(_env_file=os.path.join(os.path.dirname(__file__), '../.env'))