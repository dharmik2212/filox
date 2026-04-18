# ML Model Training Guide

This guide explains how to train the Filox CNN classifier for academic image classification.

## Overview

The Filox classifier uses a **MobileNetV3-Small** deep learning model:
- **Architecture**: Convolutional Neural Network (CNN)
- **Size**: ~2-3 MB (efficient for mobile inference)
- **Training**: Transfer learning from ImageNet
- **Classes**: 3 output classes
  - `academic`: Textbooks, notes, assignments, diagrams, whiteboards
  - `noise`: Personal photos, selfies, food, unrelated pictures
  - `current_semester`: Current academic period materials

## Step 1: Prepare Training Data

### Directory Structure

```
ml_training/
├── dataset/
│   ├── academic/          # 200-300 images
│   │   ├── textbook_01.jpg
│   │   ├── notes_02.png
│   │   └── ...
│   ├── noise/             # 200-300 images
│   │   ├── selfie_01.jpg
│   │   ├── food_02.jpg
│   │   └── ...
│   └── current_semester/  # 100-150 images
│       ├── class_photo_01.jpg
│       └── ...
└── train.py
```

### Collecting Images

#### Academic Images (~250 images)
Source from:
- Google Scholar (screenshot papers)
- Course websites (lecture slides)
- Textbook covers (publisher websites)
- GitHub (student assignments, projects)
- WikiMedia Commons (educational diagrams)

**Keywords to search:**
- "lecture notes"
- "textbook page"
- "university assignment"
- "class diagram"
- "educational diagram"

Tools:
- `bing-image-downloader` Python package
- Manual downloads from educational sites

#### Noise Images (~250 images)
Source from:
- Your phone camera roll
- Public photo datasets
- Unsplash (personal-looking photos)
- Instagram screenshots

**Types:**
- Selfies
- Food photos
- Landscape photos
- Social media screenshots
- random objects

#### Current Semester Images (~120 images)
Photos specifically from your current academic period:
- Recent class photos
- Current semester notes/papers
- Current project materials
- This semester's textbooks

### Data Requirements

- **Minimum**: 150 images per class (450 total)
- **Recommended**: 300 images per class (900 total)
- **Optimal**: 500+ images per class (1500+) for best accuracy
- **Format**: JPG, PNG (any common image format)
- **Size**: Vary from ~100KB to ~5MB

### Data Quality Tips

✅ **DO:**
- Use diverse images (different cameras, lighting, angles)
- Include images of varying quality (blurry, dark, bright)
- Balance representation (no 90% textbooks in academic folder)
- Include borderline cases (photos with some academic + personal content)

❌ **DON'T:**
- Use exact duplicates
- Include watermarked images
- Use only high-quality stock photos (model won't generalize)
- Include corrupted/non-image files

## Step 2: Setup Training Environment

```bash
cd ml_training

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 3: Configure Training

Edit `train.py` parameters:

```python
# Configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
batch_size = 32              # Adjust based on GPU memory
epochs = 50                  # More epochs = better accuracy (but slower)
learning_rate = 0.001        # Typical for fine-tuning
```

**GPU Memory Guidelines:**
- 2GB VRAM: `batch_size = 8`
- 4GB VRAM: `batch_size = 16`
- 6GB+ VRAM: `batch_size = 32-64`

## Step 4: Run Training

```bash
python train.py
```

**Output:**
```
Using device: cuda  # or cpu
✅ Model created
✅ Loaded 900 training images
Epoch 1/50 - Loss: 0.8342
Epoch 2/50 - Loss: 0.5621
...
Epoch 50/50 - Loss: 0.0234
✅ Training complete! Model saved to outputs/academic_classifier_v1.pt
```

**Training Time:**
- CPU: ~6-12 hours
- GPU (GTX 1080+): ~30-60 minutes
- GPU (RTX 3090): ~10-15 minutes

## Step 5: Evaluate Model

Create `notebooks/evaluate.py`:

```python
import torch
from torchvision import transforms
from sklearn.metrics import classification_report, confusion_matrix

# Load trained model
model = torch.load("../outputs/academic_classifier_v1.pt")

# Test on validation dataset
# Calculate accuracy, precision, recall

# Target metrics:
# Accuracy: >85%
# Precision (academic): >90%
# Recall (noise): >85%
```

## Step 6: Deploy Model

### Copy to Backend

```bash
cp outputs/academic_classifier_v1.pt ../backend/app/ml/models/academic_classifier_v1.pt
```

### Update Backend Configuration

Edit `backend/config.py`:
```python
MODEL_PATH = "app/ml/models/academic_classifier_v1.pt"
MODEL_VERSION = "1.0"  # Increment for each retrain
```

### Test Classification

```bash
# In backend directory
python -c "from app.ml.classifier import ClassifierService; c = ClassifierService(); c.load_model(); print(c.classify_file('path/to/test/image.jpg'))"
```

Expected output:
```python
{
  'class_label': 'academic',
  'confidence': 0.92,
  'reasoning': 'Detected academic content with 92% confidence...'
}
```

## Advanced: Fine-tuning on Custom Data

If accuracy is below 85%, try:

### 1. More Data
```python
# Collect additional 500+ images per class
# Retrain for 30+ more epochs
```

### 2. Advanced Augmentation
```python
transforms.Compose([
    transforms.RandomRotation(25),          # More rotation
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
    transforms.RandomPerspective(p=0.3),     # Add perspective
    transforms.ColorJitter(brightness=0.3),  # More color variation
    transforms.GaussNoise(),                  # Add noise
    ...
])
```

### 3. Hyperparameter Tuning
```python
# Try different values
learning_rates = [0.0001, 0.0005, 0.001, 0.005]
epochs = [50, 75, 100, 150]  # More epochs often helps
batch_sizes = [8, 16, 32, 64]

# Use grid search or random search
```

### 4. Different Architecture
```python
# Try MobileNetV3-Large (more accurate but slower)
from torchvision.models import mobilenet_v3_large
model = mobilenet_v3_large(pretrained=True)

# Or ResNet50 (much larger, for more accuracy)
from torchvision.models import resnet50
model = resnet50(pretrained=True)
```

## Continuous Improvement (Post-launch)

### Phase 2: Collect Real User Data
- Ask users to opt-in to send misclassified images
- Retrain monthly with accumulated data
- Improve accuracy over time

### Phase 3: Active Learning
- Flag low-confidence predictions
- Ask user to label them
- Use for retraining

### Phase 4: Multi-label Classification
```python
# Support multiple tags per image
# "contains both notes AND people"
```

## Troubleshooting

### Model Accuracy Too Low (<80%)

**Causes & Solutions:**
1. **Not enough data**
   - Collect more images (aim for 300+ per class)
   - Use data augmentation

2. **Imbalanced classes**
   - Ensure equal representation
   - Use weighted loss: `class_weight=[0.5, 0.5, 0.5]`

3. **Poor training data quality**
   - Remove blurry/corrupted images
   - Ensure clear class boundaries

4. **Model underfitting**
   - Train longer (increase epochs to 100)
   - Increase learning rate (try 0.005)

### Training Too Slow

**Solutions:**
- Use GPU (40x faster)
- Reduce batch size
- Use smaller model (MobileNetV2 instead of ResNet)
- Reduce image resolution (currently 224x224)

### Out of Memory Error

**Solutions:**
- Reduce batch size (8 → 4)
- Reduce image resolution (224 → 150)
- Use mixed precision training
- Use smaller model

### Model Not Improving

**Solutions:**
- Check learning rate (try 0.0001 or 0.01)
- Verify data preprocessing is correct
- Ensure model is actually training (loss should decrease)
- Add learning rate scheduler
- Check for data leakage (same image in train+test)

## Appendix: Model Architecture

```
Input Image (224x224x3)
    ↓
MobileNetV3-Small (pretrained on ImageNet)
  - 16 inverted residual blocks
  - 2-3 MB model size
    ↓
Feature Extraction (~576-dim vector)
    ↓
Custom Classification Head
  - Linear(576 → 128)
  - ReLU activation
  - Linear(128 → 3)
    ↓
Output: 3-class probabilities
  - softmax([academic, noise, current_semester])
```

## References

- [MobileNetV3 Paper](https://arxiv.org/abs/1905.02175)
- [PyTorch Transfer Learning](https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)
- [PyTorch Vision Models](https://pytorch.org/vision/stable/models.html)
- [Torchvision Transforms](https://pytorch.org/vision/stable/transforms.html)
