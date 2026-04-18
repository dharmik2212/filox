"""
Backend initialization
"""

from app.ml.classifier import ClassifierService
from app.ml.duplicate_detector import DuplicateDetector

__all__ = ["ClassifierService", "DuplicateDetector"]
