from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, predict
from .ml.model import skin_model

app = FastAPI(title="AI UV Tracker API")

# CORS Middleware
origins = [
    "http://localhost:3000", # Your React app's origin
    "http://localhost:3001",
    "https://ai-uv-tracker-app.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await auth.startup_db_client()
    skin_model.load_model()

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the AI UV Tracker API"}