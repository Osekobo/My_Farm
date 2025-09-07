from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    migrate = Migrate(app, db)

    with app.app_context():
        from models import User, Batch, EggProduction, Sales, Expenses, EmployeeData
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
