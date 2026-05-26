from app.models.user import User

DEMO_USERS: dict[str, dict] = {
    "admin@productpulse.com": {
        "id": "1",
        "email": "admin@productpulse.com",
        "name": "Admin User",
        "password": "admin123",
        "roles": ["admin", "analyst"],
    },
    "analyst@productpulse.com": {
        "id": "2",
        "email": "analyst@productpulse.com",
        "name": "Analyst User",
        "password": "analyst123",
        "roles": ["analyst"],
    },
}


def get_user_by_email(email: str) -> User | None:
    record = DEMO_USERS.get(email.lower())
    if not record:
        return None
    return User(
        id=record["id"],
        email=record["email"],
        name=record["name"],
        roles=record["roles"],
    )


def verify_password(email: str, password: str) -> bool:
    record = DEMO_USERS.get(email.lower())
    return record is not None and record["password"] == password
