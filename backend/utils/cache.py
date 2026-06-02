import json
import redis

from app.config import settings


redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=0,
    decode_responses=True
)


def get_cache(key: str):
    try:
        data = redis_client.get(key)

        if data:
            return json.loads(data)

        return None

    except Exception:
        return None


def set_cache(key: str, value, expire_seconds: int = None):
    try:
        redis_client.setex(
            key,
            expire_seconds or settings.CACHE_EXPIRE_SECONDS,
            json.dumps(value, default=str)
        )

    except Exception:
        pass


def delete_cache(key: str):
    try:
        redis_client.delete(key)
    except Exception:
        pass