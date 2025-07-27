from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, predict
from .ml.model import skin_model
import os # <--- ADD THIS IMPORT

# --- START OF TEMPORARY DEBUGGING CODE ---
# This will print the values that your Render server is actually seeing.
# It will print "None" if the variable is not found.
print("---- CHECKING RENDER ENV VARIABLES ----")
print(f"MONGO_CONNECTION_STRING is set: {os.environ.get('MONGO_CONNECTION_STRING') is not None}")
print(f"SECRET_KEY is set: {os.environ.get('SECRET_KEY') is not None}")
print(f"ALGORITHM is set: {os.environ.get('ALGORITHM') is not None}")
print(f"ACCESS_TOKEN_EXPIRE_MINUTES is set: {os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES') is not None}")
print("---- FINISHED CHECKING ----")
# --- END OF TEMPORARY DEBUGGING CODE ---

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