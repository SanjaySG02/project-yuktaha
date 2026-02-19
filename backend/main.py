from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
import timm
import torchvision.transforms as transforms
from PIL import Image
import io
import numpy as np
import random

# Set deterministic seeds (optional but safe)
torch.manual_seed(42)
np.random.seed(42)
random.seed(42)

# ✅ Create FastAPI app FIRST
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device
device = torch.device("cpu")

# Recreate the EXACT same model
model = timm.create_model('efficientnet_b0', pretrained=False)
model.classifier = nn.Linear(model.classifier.in_features, 1)

# Load weights
model.load_state_dict(torch.load("model.pth", map_location=device))
model = model.to(device)

# ✅ Set evaluation mode (THIS IS ENOUGH)
model.eval()

# Image transform (must match training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    image = transform(image)
    image = image.unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image)
        probability = torch.sigmoid(output).item()
    print("Confidence:", probability)


    prediction = 1 if probability > 0.5 else 0

    return {
        "prediction": prediction,
        "confidence": float(probability)
    }
