from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ContractIQ"
    API_V1_STR: str = "/api/v1"
    
    # Storage
    UPLOAD_FOLDER: str = "backend/data/uploads"
    
    # ML/AI
    GROQ_API_KEY: str = ""
    
    # DB
    DATABASE_URL: str = "sqlite:///./sql_app.db" # Default to sqlite for local dev

    class Config:
        env_file = ".env"

settings = Settings()
