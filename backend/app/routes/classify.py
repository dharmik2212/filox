from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
import json
from datetime import datetime

from app.database import get_session
from app.models import User, Classification, File
from app.schemas import (
    ClassificationRequest,
    ClassificationResponse,
    BatchClassificationRequest,
    BatchClassificationResponse,
)
from app.utils.auth import get_current_user
from app.ml.classifier import ClassifierService

router = APIRouter(prefix="/classify", tags=["classification"])

# Initialize classifier service (loaded once at startup)
classifier_service = None


@router.on_event("startup")
async def load_model():
    """Load ML model on startup"""
    global classifier_service
    classifier_service = ClassifierService()
    classifier_service.load_model()


@router.post("/single", response_model=ClassificationResponse)
async def classify_single(
    request: ClassificationRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Classify a single file
    
    POST /classify/single
    {
        "file_id": 123
    }
    """
    # Get file from database
    file = session.get(File, request.file_id)
    if not file or file.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # Run classification
        result = classifier_service.classify_file(file.file_path)
        
        # Save classification result to database
        classification = Classification(
            user_id=current_user.id,
            file_id=file.id,
            class_label=result["class_label"],
            confidence=result["confidence"],
            model_version=classifier_service.model_version,
            reasoning=result.get("reasoning"),
        )
        session.add(classification)
        session.commit()
        session.refresh(classification)
        
        return ClassificationResponse.model_validate(classification)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")


@router.post("/batch", response_model=BatchClassificationResponse)
async def classify_batch(
    request: BatchClassificationRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Classify multiple files at once
    
    POST /classify/batch
    {
        "file_ids": [1, 2, 3, 4, 5]
    }
    """
    results = []
    errors = []
    
    for file_id in request.file_ids:
        try:
            # Get file
            file = session.get(File, file_id)
            if not file or file.user_id != current_user.id:
                errors.append(f"File {file_id} not found")
                continue
            
            # Classify
            result = classifier_service.classify_file(file.file_path)
            
            # Save to database
            classification = Classification(
                user_id=current_user.id,
                file_id=file.id,
                class_label=result["class_label"],
                confidence=result["confidence"],
                model_version=classifier_service.model_version,
                reasoning=result.get("reasoning"),
            )
            session.add(classification)
            results.append(ClassificationResponse(**result, file_id=file_id))
        
        except Exception as e:
            errors.append(f"File {file_id}: {str(e)}")
    
    session.commit()
    
    return BatchClassificationResponse(
        results=results,
        total_processed=len(results),
        errors=errors if errors else None,
    )


@router.get("/{file_id}", response_model=ClassificationResponse)
async def get_classification(
    file_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get existing classification for a file"""
    statement = (
        select(Classification)
        .where(Classification.file_id == file_id)
        .where(Classification.user_id == current_user.id)
        .order_by(Classification.created_at.desc())
    )
    classification = session.exec(statement).first()
    
    if not classification:
        raise HTTPException(status_code=404, detail="Classification not found")
    
    return ClassificationResponse.model_validate(classification)
