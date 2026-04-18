from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime, timedelta
import jwt
import json

from app.database import get_session
from app.models import User
from app.schemas import GoogleLoginRequest, TokenResponse, UserProfile
from app.services.google_oauth import verify_google_token
from app.utils.auth import create_access_token
from config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/google", response_model=TokenResponse)
async def google_login(
    request: GoogleLoginRequest,
    session: Session = Depends(get_session),
):
    """
    Google OAuth login endpoint
    
    POST /auth/google
    {
        "id_token": "google_id_token_here"
    }
    
    Returns JWT token for subsequent requests
    """
    try:
        # Verify Google token
        user_info = verify_google_token(request.id_token)
        google_id = user_info.get("sub")
        email = user_info.get("email")
        name = user_info.get("name")
        picture = user_info.get("picture")
        
        # Check if user exists
        statement = select(User).where(User.google_id == google_id)
        user = session.exec(statement).first()
        
        if not user:
            # Create new user
            user = User(
                google_id=google_id,
                email=email,
                name=name,
                profile_picture_url=picture,
                current_semester="Unknown",  # User sets this in onboarding
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        else:
            # Update user info
            user.name = name
            user.profile_picture_url = picture
            user.updated_at = datetime.utcnow()
            session.add(user)
            session.commit()
        
        # Create JWT token
        access_token = create_access_token(user.id)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.jwt_expiration_hours * 3600,
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    current_user: User = Depends(),  # Requires valid token
    session: Session = Depends(get_session),
):
    """Refresh JWT token"""
    access_token = create_access_token(current_user.id)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.jwt_expiration_hours * 3600,
    )


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(),
):
    """Get current user's profile"""
    return UserProfile.model_validate(current_user)


@router.put("/semester")
async def update_current_semester(
    semester: str,
    current_user: User = Depends(),
    session: Session = Depends(get_session),
):
    """Update user's current semester (called during onboarding)"""
    user = session.get(User, current_user.id)
    user.current_semester = semester
    user.updated_at = datetime.utcnow()
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return {"status": "updated", "current_semester": user.current_semester}
