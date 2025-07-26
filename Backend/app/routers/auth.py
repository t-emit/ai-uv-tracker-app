# backend/app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
# We no longer need OAuth2PasswordRequestForm
from datetime import timedelta
from ..core.security import verify_password, create_access_token
from ..core.config import settings
# Import the new UserLogin model
from ..models.user import UserCreate, Token, UserInDB, UserLogin 
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()
db = None

@router.on_event("startup")
async def startup_db_client():
    global db
    client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
    db = client.get_database()

# The signup route is fine, no changes needed here
@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    # ... (no changes in this function)
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(email=user.email, hashed_password=hashed_password)
    await db.users.insert_one(user_in_db.dict())
    return {"message": "User created successfully"}


# --- THIS IS THE CORRECTED LOGIN FUNCTION ---
@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin): # Changed this line
    # Find the user by email from our new UserLogin model
    user = await db.users.find_one({"email": user_credentials.email}) 
    
    # Verify the password from our new UserLogin model
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Create the token (no changes here)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
# ---------------------------------------------