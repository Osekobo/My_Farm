import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev_secret_key"
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL")
        or f"sqlite:///{os.path.join(INSTANCE_DIR, 'farm.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ADMIN_SIGNUP_CODE = os.environ.get("ADMIN_SIGNUP_CODE")
