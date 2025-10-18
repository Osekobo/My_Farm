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
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "adidabarackpilly@gmail.com"
    MAIL_PASSWORD = "massmkmoimuywakq"
    MAIL_DEFAULT_SENDER = ("Golden-Yolk", "adidabarackpilly@gmail.com")

    ADMIN_SIGNUP_CODE = os.environ.get("ADMIN_SIGNUP_CODE")
