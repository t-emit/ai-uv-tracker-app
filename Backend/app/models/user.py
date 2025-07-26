# backend/app/models/user.py

from pydantic import BaseModel, EmailStr,validator
from typing import Optional

# --- MODIFY THE UserCreate MODEL ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        # You can add more rules here, e.g., requiring numbers or special characters
        # if not any(char.isdigit() for char in v):
        #     raise ValueError('Password must contain at least one number')
        return v
# -----------------------------------


class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- ADD THIS NEW MODEL ---
# This model is for receiving login credentials
class UserLogin(BaseModel):
    email: EmailStr
    password: str
# -------------------------

# This model is for storing user data in the DB (already exists)
class UserInDB(BaseModel):
    email: EmailStr
    hashed_password: str

# These models for tokens are also fine as they are
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None