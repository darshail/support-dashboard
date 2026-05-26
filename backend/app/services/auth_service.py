from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.config import settings
from app.data.users import get_user_by_email, verify_password
from app.models.user import Token, User, UserLogin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


class AuthService:
    @staticmethod
    def authenticate(credentials: UserLogin) -> User | None:
        if not verify_password(credentials.email, credentials.password):
            return None
        return get_user_by_email(credentials.email)

    @staticmethod
    def create_access_token(user: User) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        payload = {
            "sub": user.id,
            "email": user.email,
            "roles": user.roles,
            "exp": expire,
        }
        return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)

    @staticmethod
    def login(credentials: UserLogin) -> Token | None:
        user = AuthService.authenticate(credentials)
        if not user:
            return None
        token = AuthService.create_access_token(user)
        return Token(access_token=token, user=user)

    @staticmethod
    def decode_token(token: str) -> dict | None:
        try:
            return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        except Exception:
            return None
