from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.auth.router import router as auth_router
from app.models.user import User

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)


@router.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "product-pulse-api"}


@router.get("/protected", tags=["health"])
async def protected_sample(current_user: User = Depends(get_current_user)):
    return {
        "message": "Authenticated request successful",
        "user": current_user,
    }
