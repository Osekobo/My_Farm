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

    @app.route('/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        role = data.get('role')
        username = data.get('username').strip().lower()
        email = data.get('email').strip().lower()
        phone_number = data.get('phone_number').strip()
        password = data.get('password')

        existing_user = User.query.filter(
            (User.username == username) |
            (User.email == email) |
            (User.phone_number == phone_number)
        ).first()

        if existing_user:
            if existing_user.username == username:
                return jsonify({'message': 'Username already exists'}), 400
            elif existing_user.email == email:
                return jsonify({'message': 'Email already exists'}), 400
            elif existing_user.phone_number == phone_number:
                return jsonify({'message': 'Phone number already exists'}), 400

        new_user = User(
            role=role,
            username=username,
            email=email,
            phone_number=phone_number,
            password=bcrypt.generate_password_hash(password).decode('utf-8')
        )

        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'})

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        username_or_email = data.get('username_or_email')
        password = data.get('password')

        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({'message': 'Invalid credentials'}), 401

        return jsonify({'message': f'Welcome {user.username}!'})
    
    @app.route('/batch', methods=['POST', 'GET', 'PATCH'])
    def batch():
        if request.method == 'POST':
            data = request.get_json()
            batch_name = data.get('batch_name')
            breed = data.get('breed')
            acquisition_date = data.get('acquisition_date')
            initial_number = data.get('initial_number')            
            current_number = data.get('current_number')
            status = data.get('status')
            
            new_batch = Batch(
                batch_name=batch_name,
                breed=breed,
                acquisition_date=acquisition_date,
                initial_number=initial_number,
                current_number=current_number,
                status=status
            )
            db.session.add(new_batch)
            db.session.commit()
            return jsonify({'message': 'Batch created successfully'})
        
        elif request.method == 'GET':
                batch_name = request.args.get('batch_name')
                if not batch_name:
                    data = request.get_json(silent=True) or {}
                    batch_name = data.get('batch_name')
                    
                if not batch_name:
                    return jsonify({'message': 'Please provide a batch name'}), 400
                
                batch = Batch.query.filter_by(batch_name = batch_name).first()
                
                if not batch:
                    return jsonify({'message': 'No batch that goes with that name'}), 404
                
                return jsonify({
                    'id': batch.id,
                    'batch_name': batch.batch_name,
                    'breed': batch.breed,
                    'acquisition_date': batch.acquisition_date,
                    'initial_number': batch.initial_number,
                    'current_number': batch.current_number,
                    'status': batch.status
                })
            
        elif request.method == 'PATCH':
            data = request.get_json()
            batch_name = data.get('batch_name')
            
            batch = Batch.query.filter_by(batch_name = batch_name).first()
            if not batch:
                return jsonify({'message': 'Batch not found!'}), 404
            
            if 'breed' in data:
                batch.breed = data['breed']
            if 'acquisition_date' in data:
                batch.acquisition_date = data['acquisition_date']
            if 'initial_number' in data:
                batch.initial_number = data['initial_number']
            if 'current_number' in data:
                batch.current_number = data['current_number']
            if 'status' in data:
                batch.status = data['status']
                
            db.session.commit()
            return jsonify({'message': 'Batch updated successfully!'})
                         
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
