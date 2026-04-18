from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # API Configuration
    debug: bool = True
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_title: str = "Filox API - Academic File Management"
    api_version: str = "1.0.0"

    # Database
    database_url: str = "sqlite:///./filox.db"

    # Google OAuth
    google_client_id: str = "placeholder_client_id"
    google_client_secret: str = "placeholder_client_secret"

    # JWT
    secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # ML Model
    model_path: str = "app/ml/models/academic_classifier_v1.pt"
    model_version: str = "1.0"

    # Environment
    environment: str = "development"

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore",
        "protected_namespaces": ()
    }

# Initialize settings
settings = Settings()
