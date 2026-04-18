import cv2
import numpy as np
from PIL import Image
from typing import Tuple
import hashlib


class DuplicateDetector:
    """
    Detect duplicate files using multiple methods:
    1. Hash-based (100% duplicates)
    2. Perceptual hashing (visually similar images)
    3. Feature matching (detailed comparison)
    """
    
    def __init__(self):
        pass
    
    def compute_file_hash(self, file_path: str) -> str:
        """Compute SHA256 hash of file"""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    
    def compute_perceptual_hash(self, file_path: str) -> str:
        """
        Compute perceptual hash (dhash) of image
        Resistant to minor image changes (compression, slight crops, etc)
        """
        try:
            image = Image.open(file_path).convert("L")
            image = image.resize((8, 8))
            pixels = np.array(image)
            
            # Compute difference hash
            dhash = ""
            for i in range(8):
                for j in range(8):
                    if pixels[i][j] > pixels[i][j + 1] if j < 7 else 0:
                        dhash += "1"
                    else:
                        dhash += "0"
            
            return dhash
        except Exception as e:
            print(f"Error computing perceptual hash: {e}")
            return ""
    
    def hamming_distance(self, hash1: str, hash2: str) -> int:
        """Calculate hamming distance between two hashes"""
        return bin(int(hash1, 2) ^ int(hash2, 2)).count("1")
    
    def compare_perceptual_hashes(self, hash1: str, hash2: str) -> float:
        """
        Compare two perceptual hashes
        Returns similarity score 0.0-1.0 (1.0 = identical)
        """
        if not hash1 or not hash2:
            return 0.0
        
        distance = self.hamming_distance(hash1, hash2)
        similarity = 1.0 - (distance / 64.0)  # 64 bits for perceptual hash
        return max(0.0, min(1.0, similarity))
    
    def compare_images_feature_matching(self, file1_path: str, file2_path: str) -> float:
        """
        Compare images using feature matching (SIFT/ORB)
        More accurate but slower than perceptual hashing
        """
        try:
            img1 = cv2.imread(file1_path, cv2.IMREAD_GRAYSCALE)
            img2 = cv2.imread(file2_path, cv2.IMREAD_GRAYSCALE)
            
            if img1 is None or img2 is None:
                return 0.0
            
            # Initialize ORB detector (faster than SIFT, no license issues)
            orb = cv2.ORB_create(nfeatures=500)
            
            # Detect keypoints and compute descriptors
            kp1, des1 = orb.detectAndCompute(img1, None)
            kp2, des2 = orb.detectAndCompute(img2, None)
            
            if des1 is None or des2 is None:
                return 0.0
            
            # Match descriptors
            bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
            matches = bf.match(des1, des2)
            matches = sorted(matches, key=lambda x: x.distance)
            
            # Calculate similarity based on good matches
            good_matches = [m for m in matches if m.distance < 50]
            similarity = len(good_matches) / max(len(kp1), len(kp2), 1)
            
            return similarity
        
        except Exception as e:
            print(f"Error in feature matching: {e}")
            return 0.0
    
    def compare_files(self, file1_path: str, file2_path: str) -> float:
        """
        Compare two files and return similarity score (0.0-1.0)
        Uses hybrid approach: hash first, then perceptual if not exact match
        """
        # Step 1: Exact hash match (100% duplicate)
        hash1 = self.compute_file_hash(file1_path)
        hash2 = self.compute_file_hash(file2_path)
        
        if hash1 == hash2:
            return 1.0  # Exact duplicate
        
        # Step 2: Perceptual hash similarity
        phash1 = self.compute_perceptual_hash(file1_path)
        phash2 = self.compute_perceptual_hash(file2_path)
        
        perceptual_similarity = self.compare_perceptual_hashes(phash1, phash2)
        
        # Step 3: If high perceptual similarity, use feature matching for confirmation
        if perceptual_similarity > 0.8:
            feature_similarity = self.compare_images_feature_matching(file1_path, file2_path)
            # Average perceptual and feature similarity
            return (perceptual_similarity + feature_similarity) / 2
        
        return perceptual_similarity
