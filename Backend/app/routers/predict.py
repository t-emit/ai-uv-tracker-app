from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from ..ml.model import skin_model
from ..core.security import jwt
from ..core.config import settings
from ..models.user import TokenData

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    return token_data

@router.post("/")
async def analyze_skin(
    file: UploadFile = File(...),
    current_user: TokenData = Depends(get_current_user)
):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    image_bytes = await file.read()
    result = skin_model.predict(image_bytes)
    
    # Optional: Save prediction to DB linked to the user
    # await db.predictions.insert_one({"user": current_user.email, **result})
    
    # Format confidence for display
    result['confidence'] = f"{result['confidence']:.2%}"
    return result