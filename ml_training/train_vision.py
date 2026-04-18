import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
from PIL import ImageFile

# Fix for "image file is truncated" error which we encountered before
ImageFile.LOAD_TRUNCATED_IMAGES = True

def train_model():
    # 1. Setup Configuration
    # We will use the user's dataset folder
    data_dir = r'E:\filox\datasets'
    
    # Check if dataset exists
    if not os.path.exists(data_dir):
        print(f"Dataset directory not found at {data_dir}.")
        return

    batch_size = 16
    num_epochs = 10
    learning_rate = 0.001
    
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # 2. Data Preprocessing
    # Standard normalization for ImageNet models
    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # Load dataset
    try:
        full_dataset = datasets.ImageFolder(data_dir, transform=data_transforms)
        class_names = full_dataset.classes
        print(f"Classes found: {class_names}")
    except RuntimeError as e:
        print("Error loading dataset. Make sure you have valid images in the 'academic' and 'noise' folders.")
        return

    if len(full_dataset) == 0:
        print("No images found in dataset folders! Add images and try again.")
        return

    # Create Data Loader
    dataloader = DataLoader(full_dataset, batch_size=batch_size, shuffle=True, num_workers=0)

    # 3. Model Definition
    # Using MobileNetV3 for fast, lightweight inference on mobile/backend
    print("Loading MobileNetV3 model...")
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    
    # Freeze earlier layers (optional, but good for small datasets)
    for param in model.parameters():
        param.requires_grad = False

    # Replace the final classifier layer for n classes dynamically
    num_ftrs = model.classifier[3].in_features
    num_classes = len(class_names)
    model.classifier[3] = nn.Linear(num_ftrs, num_classes)
    print(f"Model modified to classify {num_classes} classes.")
    
    model = model.to(device)

    # 4. Loss and Optimizer
    criterion = nn.CrossEntropyLoss()
    # Only train the newly added classifier parameters
    optimizer = optim.Adam(model.classifier.parameters(), lr=learning_rate)

    # 5. Training Loop
    print("Starting training loop...")
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        running_corrects = 0

        for inputs, labels in dataloader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            # Zero the parameter gradients
            optimizer.zero_grad()

            # Forward pass
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            loss = criterion(outputs, labels)

            # Backward pass and optimize
            loss.backward()
            optimizer.step()

            # Statistics
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)

        epoch_loss = running_loss / len(full_dataset)
        epoch_acc = running_corrects.double() / len(full_dataset)

        print(f'Epoch {epoch+1}/{num_epochs} - Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

    print("Training complete!")

    # 6. Save the Model
    save_path = os.path.join(os.path.dirname(__file__), 'binary_vision_model.pth')
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")

if __name__ == '__main__':
    train_model()
