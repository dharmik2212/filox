import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image, ImageFile
import io

# Handle truncated images
ImageFile.LOAD_TRUNCATED_IMAGES = True

class VisionService:
    def __init__(self):
        self.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
        self.model_path = r"E:\filox\ml_training\binary_vision_model.pth"
        
        # The classes that were detected during your dataset training
        self.class_names = ['avi', 'ayush', 'dax', 'dharmi', 'jay', 'krisha', 'man', 'prit', 'rudra', 'zeel']
        
        self.data_transforms = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        self.model = self._load_model()

    def _load_model(self):
        print("Loading MobileNetV3 for inference...")
        model = models.mobilenet_v3_small(weights=None) # Start fresh, load our weights
        num_ftrs = model.classifier[3].in_features
        model.classifier[3] = nn.Linear(num_ftrs, len(self.class_names))
        
        if os.path.exists(self.model_path):
            model.load_state_dict(torch.load(self.model_path, map_location=self.device))
            print("âœ… Model weights loaded successfully.")
        else:
            print(f"âš ï¸  Warning: Model {self.model_path} not found.")
            
        model = model.to(self.device)
        model.eval() # Set to evaluation mode
        return model

    def predict(self, image_bytes: bytes) -> str:
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            input_tensor = self.data_transforms(image).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                outputs = self.model(input_tensor)
                _, preds = torch.max(outputs, 1)
                
            predicted_class_idx = preds.item()
            return self.class_names[predicted_class_idx]
        except Exception as e:
            print(f"Error predicting image: {e}")
            return "error"
