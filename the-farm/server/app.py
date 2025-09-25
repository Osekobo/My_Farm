from flask import Flask, request, jsonify
from extensions import db, bcrypt, migrate
from config import Config
from dotenv import load_dotenv
from models import User, Batch, EggProduction, Sales, Expenses, EmployeeData
from datetime import datetime, timedelta
import pytz

kenya_tz = pytz.timezone("Africa/Nairobi")
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

    # ------------------- BATCH -------------------
    @app.route('/batch', methods=['POST', 'GET', 'PATCH', 'DELETE'])
    def batch():
        if request.method == 'POST':
            data = request.get_json()
            batch_name = data.get('batch_name')
            breed = data.get('breed')
            acquisition_date_str = data.get('acquisition_date')
            try:
                acquisition_date = datetime.strptime(acquisition_date_str, '%m/%d/%Y').date()
            except Exception:
                return jsonify({'message': 'Invalid date format, use MM/DD/YYYY'}), 400
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
            batch = Batch.query.filter_by(batch_name=batch_name).first()
            if not batch:
                return jsonify({'message': 'No batch that goes with that name'}), 404
            return jsonify({
                'id': batch.id,
                'batch_name': batch.batch_name,
                'breed': batch.breed,
                'acquisition_date': batch.acquisition_date.isoformat() if batch.acquisition_date else None,
                'initial_number': batch.initial_number,
                'current_number': batch.current_number,
                'status': batch.status
            })

        elif request.method == 'PATCH':
            data = request.get_json()
            batch_name = data.get('batch_name')
            batch = Batch.query.filter_by(batch_name=batch_name).first()
            if not batch:
                return jsonify({'message': 'Batch not found!'}), 404
            if 'breed' in data:
                batch.breed = data['breed']
            if 'acquisition_date' in data:
                try:
                    batch.acquisition_date = datetime.strptime(data['acquisition_date'], '%m/%d/%Y').date()
                except Exception:
                    return jsonify({'message': 'Invalid date format, use MM/DD/YYYY'}), 400
            if 'initial_number' in data:
                batch.initial_number = data['initial_number']
            if 'current_number' in data:
                batch.current_number = data['current_number']
            if 'status' in data:
                batch.status = data['status']
            db.session.commit()
            return jsonify({'message': 'Batch updated successfully!'})

        elif request.method == 'DELETE':
            data = request.get_json()
            batch_name = data.get('batch_name')
            if not batch_name:
                return jsonify({'message': 'Please provide batch_name'}), 400
            batch = Batch.query.filter_by(batch_name=batch_name).first()
            if not batch:
                return jsonify({'message': f'No batch found with name {batch_name}'}), 404
            db.session.delete(batch)
            db.session.commit()
            return jsonify({'message': 'Batch deleted successfully'}), 200

    @app.route('/eggsproduction', methods=['POST', 'PATCH', 'GET'])
    def eggsproduction():
        if request.method == 'POST':
            data = request.get_json()
            batch_id = data.get('batch_id')
            eggs_collected = int(data.get("eggs_collected", 0))
            broken_eggs = int(data.get("broken_eggs", 0))
            remarks = data.get("remarks")
            date_str = data.get('date')
            if date_str:
                try:
                    date_value = datetime.strptime(date_str, '%m/%d/%Y').date()
                except ValueError:
                    return jsonify({'message': 'Invalid date format!'}), 400
            else:
                date_value = datetime.now(kenya_tz).date()
            remaining_eggs = eggs_collected - broken_eggs
            yesterday = date_value - timedelta(days=1)
            yesterday_record = EggProduction.query.filter_by(date=yesterday, batch_id=batch_id).first()
            if yesterday_record:
                remaining_eggs += yesterday_record.extra_eggs
            quantity_in_crates = remaining_eggs // 30
            extra_eggs = remaining_eggs % 30
            batch = Batch.query.filter_by(id=batch_id).first()
            if not batch:
                return jsonify({'message': 'There is no batch with that ID'}), 404
            new_eggs = EggProduction(
                batch_id=batch_id,
                date=date_value,
                eggs_collected=eggs_collected,
                broken_eggs=broken_eggs,
                remaining_eggs=remaining_eggs,
                remarks=remarks,
                quantity_in_crates=quantity_in_crates,
                extra_eggs=extra_eggs
            )
            db.session.add(new_eggs)
            db.session.commit()
            return jsonify({'message': 'New eggs data added successfully'}), 200

        elif request.method == 'GET':
            date_str = request.args.get('date')
            try:
                date_value = datetime.strptime(date_str, '%m/%d/%Y').date()
            except Exception:
                return jsonify({'message': 'Invalid date format, use MM/DD/YYYY'}), 400
            record = EggProduction.query.filter_by(date=date_value).first()
            if not record:
                return jsonify({'message': 'No record for that date'}), 404
            return jsonify({
                'batch_id': record.batch_id,
                'date': record.date.isoformat(),
                'eggs_collected': record.eggs_collected,
                'broken_eggs': record.broken_eggs,
                'remaining_eggs': record.remaining_eggs,
                'remarks': record.remarks,
                'quantity_in_crates': record.quantity_in_crates,
                'extra_eggs': record.extra_eggs
            })

        elif request.method == 'PATCH':
            data = request.get_json()
            date_str = data.get('date')
            try:
                date_value = datetime.strptime(date_str, '%m/%d/%Y').date()
            except Exception:
                return jsonify({'message': 'Invalid date format, use MM/DD/YYYY'}), 400
            record = EggProduction.query.filter_by(date=date_value).first()
            if not record:
                return jsonify({'message': 'No record for that date'}), 404
            if 'batch_id' in data:
                record.batch_id = data['batch_id']
            if 'broken_eggs' in data:
                record.broken_eggs = data['broken_eggs']
            if 'remaining_eggs' in data:
                record.remaining_eggs = data['remaining_eggs']
            if 'remarks' in data:
                record.remarks = data['remarks']
            db.session.commit()
            return jsonify({'message': 'Data updated successfully!'}), 200

    @app.route('/sales', methods=['POST', 'GET', 'PATCH'])
    def sales():
        if request.method == 'POST':
            data = request.get_json()

            egg_production_id = data.get('egg_production_id')

            date_str = data.get('date')
            if date_str:
                try:
                    date = datetime.strptime(date_str, '%m/%d/%Y').date()
                except ValueError:
                    return jsonify({'message': 'Invalid date format, use MM/DD/YYYY'}), 400
            else:
                date = datetime.now(kenya_tz).date()

            buyer_name = data.get('buyer_name')
            quantity_in_crates = int(data.get('quantity_in_crates'))
            price_per_tray = float(data.get('price_per_tray'))
            transport_costs = float(data.get('transport_costs'))

            selling_price = quantity_in_crates * price_per_tray
            final_amount = selling_price - transport_costs

            new_sales = Sales(
                egg_production_id=egg_production_id,
                date=date,
                buyer_name=buyer_name,
                quantity_in_crates=quantity_in_crates,
                price_per_tray=price_per_tray,
                transport_costs=transport_costs,
                selling_price=selling_price,
                final_amount=final_amount
            )

            db.session.add(new_sales)
            db.session.commit()
            return jsonify({'message': 'New Sale added successfully!'}), 201
        
        elif request.method == 'GET':
            date_str = request.args.get('date')
            try:
                date_value = datetime.strptime(date_str, '%m/%d/%Y').date()
            except Exception:
                return jsonify({'message': 'Invalid date format!'}), 400
            sale = Sales.query.filter_by(date=date_value).first()
            if not sale:
                return jsonify({'message': f'There are no sales on {date_str}'})
            return jsonify({
                'date': sale.date.isoformat(),
                'buyer_name': sale.buyer_name,
                'quantity_in_crates': sale.quantity_in_crates,
                'price_per_tray': float(sale.price_per_tray),
                'transport_costs': float(sale.transport_costs),
                'selling_price': float(sale.selling_price),
                'final_amount': float(sale.final_amount)
            })
            
        elif request.method == 'PATCH':
            data = request.get_json()
            date_str = data.get('date')
            
            try:
                date_value = datetime.strptime(date_str, '%m/%d/%Y').date()
            except Exception:
                return jsonify({'message': 'Invalid date format!'}), 400
            sale = Sales.query.filter_by(date=date_value).first()
            if not sale:
                return jsonify({'message': 'No sale of that date'}), 404
            if 'date' in data:
                try:
                    sale.date = datetime.strptime(data['date'], '%m/%d/%Y').date()
                except Exception:
                    return jsonify({'message': 'Invalid date format for update, use MM/DD/YYYY'}), 400
            if 'buyer_name' in data:
                sale.buyer_name = data['buyer_name']
            if 'quantity_in_crates' in data:
                sale.quantity_in_crates = data['quantity_in_crates']
            if 'price_per_tray' in data:
                sale.price_per_tray = data['price_per_tray']
            if 'transport_costs' in data:
                sale.transport_costs = data['transport_costs']
            
            db.session.commit()
            return jsonify({'message': 'Sale updated successfully'}), 200
        
    @app.route('/expenses', methods=['POST', 'GET', 'PATCH'])
    def expenses:
        if request.method == 'POST':
            data = data.get_json
            date_str = data.get('date')
            if date_str:
                try:
                    date = datetime.strptime(date_str, '%m/%d/%Y').date()
                except ValueError:
                    return jsonify({'message': 'Invalid date format, use MM/DD/YYYY'}), 400
            else:
                date = datetime.now(kenya_tz).date()
            category = data.get('category');
            amount_spent = data.get('amount_spent')
            description = data.get('description')
            
            new_expense = Expenses(
                date = date,
                category = category,
                amount_spent = amount_spent,
                description = description
            )    
            db.session.add(new_expense)
            db.session.commit()
            
        elif request.method == 'GET':
            data = data.get_json()
            category = data.get('category')
            
            expence = Exception.query.filter_by(category = category).first()
            if not expence:
                return jsonify({'message': 'There is expence with that category!'})
            else:
                return jsonify({
                    'date': expense.date,
                    'category': expence.category,
                    'amount_spent': expence.amount_spent,
                    'description': expence.description
                })  
                
        elif request.method == 'PATCH':
            data = request.get_json()
            category = data.get('category')
            
            expence = Expenses.query.filter_by(category=category).first()
            if not expence:
                return jsonify({'message': 'There is no such category!'}),404
            if 'date' in data:
                try:
                    expense.date = datetime.strptime(data['date'], '%m/%d/%Y').date()
                except Exception:
                    return jsonify({'message': 'Invalid date format for update, use MM/DD/YYYY'}), 400
            if 'category' in data:
                expence.category = data['category']
            if 'amount_spent' in data:
                expence.amount_spent = data['amount_spent']
            if 'description' in data:
                expence.description = data['description']
                
            db.session.commit()
            return jsonify({'message': 'Expense updated successfully!'})
                
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
    