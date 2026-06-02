from passlib.context import CryptContext


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def normalize_password(password: str) -> str:
    if not password:
        return ""

    return password.encode("utf-8")[:72].decode(
        "utf-8",
        errors="ignore"
    )


def hash_password(password: str) -> str:
    return pwd_context.hash(normalize_password(password))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(
            normalize_password(plain_password),
            hashed_password
        )
    except Exception:
        return False