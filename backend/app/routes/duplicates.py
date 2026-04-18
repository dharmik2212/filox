from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
import hashlib
from typing import List

from app.database import get_session
from app.models import User, File, DuplicatePair
from app.schemas import (
    DuplicateDetectionRequest,
    DuplicateDetectionResponse,
    DuplicatePairResponse,
)
from app.utils.auth import get_current_user
from app.ml.duplicate_detector import DuplicateDetector

router = APIRouter(prefix="/duplicates", tags=["duplicates"])

duplicate_detector = None


@router.on_event("startup")
async def load_detector():
    """Initialize duplicate detector on startup"""
    global duplicate_detector
    duplicate_detector = DuplicateDetector()


@router.post("/detect", response_model=DuplicateDetectionResponse)
async def detect_duplicates(
    request: DuplicateDetectionRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Detect duplicate files using hash and perceptual matching
    
    POST /duplicates/detect
    {
        "file_ids": [1, 2, 3, 4, 5],
        "similarity_threshold": 0.85
    }
    """
    # Get all files for user
    files = [session.get(File, fid) for fid in request.file_ids]
    files = [f for f in files if f and f.user_id == current_user.id]
    
    if not files:
        raise HTTPException(status_code=404, detail="No valid files found")
    
    duplicate_pairs = []
    
    # Compare each pair of files
    for i, file1 in enumerate(files):
        for file2 in files[i + 1 :]:
            try:
                # Calculate similarity
                similarity_score = duplicate_detector.compare_files(
                    file1.file_path, file2.file_path
                )
                
                if similarity_score >= request.similarity_threshold:
                    # Save to database
                    pair = DuplicatePair(
                        user_id=current_user.id,
                        file1_id=file1.id,
                        file2_id=file2.id,
                        hash_match=(file1.file_hash == file2.file_hash),
                        overall_similarity=similarity_score,
                        detection_method="hybrid",
                    )
                    session.add(pair)
                    
                    duplicate_pairs.append(
                        DuplicatePairResponse(
                            id=0,  # temp
                            file1_id=file1.id,
                            file2_id=file2.id,
                            file1_name=file1.file_name,
                            file2_name=file2.file_name,
                            overall_similarity=similarity_score,
                            detection_method="hybrid",
                        )
                    )
            except Exception as e:
                print(f"Error comparing {file1.file_name} and {file2.file_name}: {e}")
    
    session.commit()
    
    return DuplicateDetectionResponse(
        duplicate_pairs=duplicate_pairs,
        total_duplicates_found=len(duplicate_pairs),
        total_files_scanned=len(files),
    )


@router.get("/list", response_model=List[DuplicatePairResponse])
async def list_duplicates(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get all detected duplicates for current user"""
    pairs = session.query(DuplicatePair).filter(DuplicatePair.user_id == current_user.id).all()
    return pairs
