from flask import Flask, request, jsonify
from extensions import db, bcrypt, migrate
from config import Config
from dotenv import load_dotenv
from models import User, Batch, EggProduction, Sales, Expenses, EmployeeData

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    @app.route('/signup', methods = ['POST'])
    def signup():
        data = request.get_json()
        role = data.get('role')
        username = data.get('username')
        email = data.get('email')
        phone_number = data.get('phone_number')
        password = data.get('password')

        existing_user = User.query.filter(
            (User.username == username.strip().lower()) |
            (User.email == email.strip().lower()) |
            (User.phone_number == phone_number.strip())
        ).first()

        if existing_user:
            if existing_user.username == username.strip().lower():
                return jsonify({'message': 'Username already exists'}), 400
            elif existing_user.email == email.strip().lower():
                return jsonify({'message': 'Email already exists'}), 400
            else:
                return jsonify({'message': 'Phone number already exists'}), 400
        
        new_user = User(
            role = role,
            username = username,
            email = email,
            phone_number = phone_number,
            password = bcrypt.generate_password_hash(password).decode('utf-8')
    )

        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'})


    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)