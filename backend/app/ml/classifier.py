import torch
import torchvision.transforms as transforms
from PIL import Image
import os
from typing import Dict
from torchvision.models import mobilenet_v3_small

from config import settings


class ClassifierService:
    """
    Deep Learning CNN Classifier for academic photos
    Uses MobileNetV3-Small for efficient inference
    """
    
    def __init__(self):
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_version = settings.model_version
        self.classes = ["academic", "noise", "current_semester"]
        self.class_to_idx = {cls: idx for idx, cls in enumerate(self.classes)}
        self.idx_to_class = {idx: cls for cls, idx in self.class_to_idx.items()}
        
        # Image preprocessing pipeline
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            ),
        ])
    
    def load_model(self):
        """Load pre-trained model"""
        try:
            # Initialize MobileNetV3-Small
            self.model = mobilenet_v3_small(pretrained=True)
            
            # Replace final classification layer for 3 classes
            # MobileNetV3 has 1000 output classes, we need 3
            in_features = self.model.classifier[3].in_features
            self.model.classifier[3] = torch.nn.Linear(in_features, len(self.classes))
            
            # If trained model exists, load weights
            if os.path.exists(settings.model_path):
                checkpoint = torch.load(settings.model_path, map_location=self.device)
                if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                    self.model.load_state_dict(checkpoint["model_state_dict"])
                    self.model_version = checkpoint.get("version", settings.model_version)
                else:
                    self.model.load_state_dict(checkpoint)
            
            self.model.to(self.device)
            self.model.eval()
            print(f"✅ Model loaded successfully: {settings.model_path}")
        
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            print("⚠️  Using untrained model - classification may be inaccurate")
    
    def classify_file(self, file_path: str) -> Dict:
        """
        Classify an image file
        
        Returns:
        {
            "class_label": "academic|noise|current_semester",
            "confidence": 0.92,
            "reasoning": "Contains textbook-like formatting"
        }
        """
        try:
            # Load and preprocess image
            image = Image.open(file_path).convert("RGB")
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Run inference
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.softmax(outputs, dim=1)
                confidence, predicted = torch.max(probabilities, 1)
            
            class_label = self.idx_to_class[predicted.item()]
            confidence_score = float(confidence.item())
            
            # Generate reasoning based on confidence
            reasoning = self._generate_reasoning(
                class_label, confidence_score, probabilities
            )
            
            return {
                "class_label": class_label,
                "confidence": confidence_score,
                "reasoning": reasoning,
            }
        
        except Exception as e:
            print(f"Error classifying {file_path}: {e}")
            return {
                "class_label": "noise",
                "confidence": 0.5,
                "reasoning": f"Error during classification: {str(e)}",
            }
    
    def _generate_reasoning(self, label: str, confidence: float, probabilities) -> str:
        """Generate human-readable reasoning for classification"""
        if label == "academic":
            return f"Detected academic content with {confidence:.0%} confidence - likely textbook, notes, or assignment"
        elif label == "current_semester":
            return f"Identified as current semester material with {confidence:.0%} confidence"
        else:  # noise
            return f"Classified as non-academic with {confidence:.0%} confidence - likely personal photo or unrelated image"
