from google.auth.transport.requests import Request
from google.oauth2 import id_token
import os

from config import settings


def verify_google_token(token: str) -> dict:
    """
    Verify Google OAuth token and return user info
    """
    try:
        idinfo = id_token.verify_oauth2_token(token, Request(), settings.google_client_id)
        
        if idinfo["aud"] != settings.google_client_id:
            raise ValueError("Token audience does not match")
        
        return idinfo
    except Exception as e:
        raise Exception(f"Token verification failed: {str(e)}")
