from flask import Flask, request, jsonify
from extensions import db, bcrypt, migrate
from config import Config
from dotenv import load_dotenv
from models import User, Batch, EggProduction, Sales, Expenses, EmployeeData, Profit, Stock
from profits_util import generate_profit_record
from datetime import datetime, timedelta
from sqlalchemy import func
import pytz
from flask_cors import CORS


kenya_tz = pytz.timezone("Africa/Nairobi")
load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    @app.route('/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        role = data.get("role")
        username = data.get("username").strip().lower()
        email = data.get("email").strip().lower()
        phone_number = data.get("phone_number").strip()
        password = data.get("password")
        admin_code = data.get("admin_code")

        if role == "admin":
            if admin_code != app.config["ADMIN_SIGNUP_CODE"]:
                return jsonify({"message": "Invalid admin signup code"}), 403

        existing_user = User.query.filter(
            (User.username == username)
            | (User.email == email)
            | (User.phone_number == phone_number)
        ).first()

        if existing_user:
            if existing_user.username == username:
                return jsonify({"message": "Username already exists"}), 400
            elif existing_user.email == email:
                return jsonify({"message": "Email already exists"}), 400
            elif existing_user.phone_number == phone_number:
                return jsonify({"message": "Phone number already exists"}), 400

        new_user = User(
            role=role,
            username=username,
            email=email,
            phone_number=phone_number,
            password=bcrypt.generate_password_hash(password).decode("utf-8"),
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": f"{role.capitalize()} account created successfully!"}), 201

    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        username_or_email = data.get("username_or_email")
        password = data.get("password")

        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({"message": "Invalid credentials"}), 401

        return jsonify({"message": f"Welcome {user.username}!"})

    @app.route("/batch", methods=["POST", "GET", "PATCH", "DELETE"])
    def batch():
        if request.method == "POST":
            data = request.get_json()
            batch_name = data.get("batch_name")
            breed = data.get("breed")
            acquisition_date_str = data.get("acquisition_date")
            try:
                acquisition_date = datetime.strptime(acquisition_date_str, "%m/%d/%Y").date()
            except Exception:
                return jsonify({"message": "Invalid date format, use MM/DD/YYYY"}), 400
            initial_number = data.get("initial_number")
            current_number = data.get("current_number")
            status = data.get("status")
            new_batch = Batch(
                batch_name=batch_name,
                breed=breed,
                acquisition_date=acquisition_date,
                initial_number=initial_number,
                current_number=current_number,
                status=status,
            )
            db.session.add(new_batch)
            db.session.commit()
            return jsonify({"message": "Batch created successfully"})

        elif request.method == "GET":
           batch = Batch.query.all()
           if not batch:
               return jsonify([]), 200;
           return([b.to_dict() for b in batch]), 200;

        elif request.method == "PATCH":
            data = request.get_json()
            batch_name = data.get("batch_name")
            batch = Batch.query.filter_by(batch_name=batch_name).first()
            if not batch:
                return jsonify({"message": "Batch not found!"}), 404;
            if "breed" in data:
                batch.breed = data["breed"]
            if "acquisition_date" in data:
                try:
                    batch.acquisition_date = datetime.strptime(data["acquisition_date"], "%m/%d/%Y").date()
                except Exception:
                    return jsonify({"message": "Invalid date format, use MM/DD/YYYY"}), 400
            if "initial_number" in data:
                batch.initial_number = data["initial_number"]
            if "current_number" in data:
                batch.current_number = data["current_number"]
            if "status" in data:
                batch.status = data["status"]
            db.session.commit()
            return jsonify({"message": "Batch updated successfully!"})

        elif request.method == "DELETE":
            data = request.get_json()
            batch_name = data.get("batch_name")
            if not batch_name:
                return jsonify({"message": "Please provide batch_name"}), 400
            batch = Batch.query.filter_by(batch_name=batch_name).first()
            if not batch:
                return jsonify({"message": f"No batch found with name {batch_name}"}), 404
            db.session.delete(batch)
            db.session.commit()
            return jsonify({"message": "Batch deleted successfully"}), 200

    @app.route("/eggsproduction", methods=["POST", "PATCH", "GET"])
    def eggsproduction():
        if request.method == "POST":
            data = request.get_json()
            batch_id = data.get("batch_id")
            eggs_collected = int(data.get("eggs_collected", 0))
            broken_eggs = int(data.get("broken_eggs", 0))
            remarks = data.get("remarks")
            date_str = data.get("date")

            if date_str:
                try:
                    date_value = datetime.strptime(date_str, "%m/%d/%Y").date()
                except ValueError:
                    return jsonify({"message": "Invalid date format!"}), 400
            else:
                date_value = datetime.now(kenya_tz).date()

            batch = Batch.query.filter_by(id=batch_id).first()
            if not batch:
                return jsonify({"message": "There is no batch with that ID"}), 404

            remaining_eggs = eggs_collected - broken_eggs

            prev_row = (
                EggProduction.query.filter_by(batch_id=batch_id)
                .order_by(EggProduction.date.desc())
                .first()
            )

            if prev_row:
                total_eggs = remaining_eggs + (prev_row.extra_eggs or 0)
            else:
                total_eggs = remaining_eggs

            quantity_in_crates = total_eggs // 30
            extra_eggs = total_eggs % 30
            
            stock = Stock.query.first()
            if not stock:
                stock = Stock(crates_in_store = 0)
                db.session.add(stock)
                
            stock.crates_in_store += quantity_in_crates
            

            new_eggs = EggProduction(
                batch_id=batch_id,
                date=date_value,
                eggs_collected=eggs_collected,
                broken_eggs=broken_eggs,
                remaining_eggs=remaining_eggs,
                remarks=remarks,
                quantity_in_crates=quantity_in_crates,
                extra_eggs=extra_eggs,
            )
            db.session.add(new_eggs)
            db.session.commit()
            return jsonify({"message": "New eggs data added successfully"}), 200

        elif request.method == "GET":
            eggsproduction = EggProduction.query.all();
            if not eggsproduction:
                return jsonify({"message": "There is no Eggs production data!"})
            return([e.to_dict() for e in eggsproduction]), 200
            
        elif request.method == "PATCH":
            data = request.get_json()
            date_str = data.get("date")
            try:
                date_value = datetime.strptime(date_str, "%m/%d/%Y").date()
            except Exception:
                return jsonify({"message": "Invalid date format, use MM/DD/YYYY"}), 400
            record = EggProduction.query.filter_by(date=date_value).first()
            if not record:
                return jsonify({"message": "No record for that date"}), 404
            if "batch_id" in data:
                record.batch_id = data["batch_id"]
            if "broken_eggs" in data:
                record.broken_eggs = data["broken_eggs"]
            if "remaining_eggs" in data:
                record.remaining_eggs = data["remaining_eggs"]
            if "remarks" in data:
                record.remarks = data["remarks"]
            db.session.commit()
            return jsonify({"message": "Data updated successfully!"}), 200

    @app.route("/sales", methods=["POST", "GET", "PATCH"])
    def sales():
        if request.method == "POST":
            data = request.get_json()
            date_str = data.get("date")
            if date_str:
                try:
                    date = datetime.strptime(date_str, "%m/%d/%Y").date()
                except ValueError:
                    return jsonify({"message": "Invalid date format, use MM/DD/YYYY"}), 400
            else:
                date = datetime.now(kenya_tz).date()

            buyer_name = data.get("buyer_name")
            quantity_in_crates = int(data.get("quantity_in_crates"))
            price_per_tray = float(data.get("price_per_tray"))
            transport_costs = float(data.get("transport_costs"))

            selling_price = quantity_in_crates * price_per_tray
            final_amount = selling_price - transport_costs
            
            stock = Stock.query.first()
            if stock:
                stock.crates_in_store -= data.get("quantity_in_crates", 0)
                if stock.crates_in_store < 0:
                    stock.crates_in_store = 0

            new_sales = Sales(
                date=date,
                buyer_name=buyer_name,
                quantity_in_crates=quantity_in_crates,
                price_per_tray=price_per_tray,
                transport_costs=transport_costs,
                selling_price=selling_price,
                final_amount=final_amount,
            )
            db.session.add(new_sales)
            db.session.commit()
            return jsonify({"message": "New Sale added successfully!"}), 201

        elif request.method == "GET":
            sales = Sales.query.all()
            if not sales:
                return jsonify({"message": "There are no sales records available"}), 404
            return jsonify([s.to_dict() for s in sales]), 200

        elif request.method == "PATCH":
            data = request.get_json()
            date_str = data.get("date")
            try:
                date_value = datetime.strptime(date_str, "%m/%d/%Y").date()
            except Exception:
                return jsonify({"message": "Invalid date format!"}), 400
            sale = Sales.query.filter_by(date=date_value).first()
            if not sale:
                return jsonify({"message": "No sale of that date"}), 404
            if "date" in data:
                try:
                    sale.date = datetime.strptime(data["date"], "%m/%d/%Y").date()
                except Exception:
                    return jsonify({"message": "Invalid date format for update, use MM/DD/YYYY"}), 400
            if "buyer_name" in data:
                sale.buyer_name = data["buyer_name"]
            if "quantity_in_crates" in data:
                sale.quantity_in_crates = data["quantity_in_crates"]
            if "price_per_tray" in data:
                sale.price_per_tray = data["price_per_tray"]
            if "transport_costs" in data:
                sale.transport_costs = data["transport_costs"]
            db.session.commit()
            return jsonify({"message": "Sale updated successfully"}), 200
        
    @app.route("/stock", methods=["GET"])
    def get_stock():
        stock = Stock.query.first()
        if not stock:
           return jsonify({'message': 'No stock data found!'}), 400
       
        return jsonify(stock.to_dict()), 200

    @app.route("/expenses", methods=["POST", "GET", "PATCH"])
    def expenses():
        if request.method == "POST":
            data = request.get_json()
            date_str = data.get("date")
            if date_str:
                try:
                    date = datetime.strptime(date_str, "%m/%d/%Y").date()
                except ValueError:
                    return jsonify({"message": "Invalid date format, use MM/DD/YYYY"}), 400
            else:
                date = datetime.now(kenya_tz).date()
                category = data.get("category")
                amount_spent = data.get("amount_spent")
                description = data.get("description")

            new_expense = Expenses(
                date=date,
                category=category,
                amount_spent=amount_spent,
                description=description,
            )
            db.session.add(new_expense)
            db.session.commit()
            return jsonify({"message": "Expense added successfully!"}), 201

        elif request.method == "GET":
            expenses = Expenses.query.all()
            if not expenses:
                return jsonify([]), 200;
            else:
                return jsonify([e.to_dict() for e in expenses]), 200

        elif request.method == "PATCH":
            data = request.get_json()
            category = data.get("category")
            expense = Expenses.query.filter_by(category=category).first()
            if not expense:
                return jsonify({"message": "There is no such category!"}), 404
            if "date" in data:
                try:
                    expense.date = datetime.strptime(data["date"], "%m/%d/%Y").date()
                except Exception:
                    return jsonify({"message": "Invalid date format for update, use MM/DD/YYYY"}), 400
            if "category" in data:
                expense.category = data["category"]
            if "amount_spent" in data:
                expense.amount_spent = data["amount_spent"]
            if "description" in data:
                expense.description = data["description"]
            db.session.commit()
            return jsonify({"message": "Expense updated successfully!"})

    @app.route("/employeedata", methods=["POST", "PATCH", "GET"])
    def employeedata():
        if request.method == "POST":
            data = request.get_json()
            name = data.get("name")
            phone_number = data.get("phone_number")
            email = data.get("email")
            role = data.get("role")
            salary = data.get("salary")

            existing = EmployeeData.query.filter_by(name=name).first()
            if existing:
                return jsonify({"message": "Employee already exists"})
            else:
                new_employee = EmployeeData(
                    name=name,
                    phone_number=phone_number,
                    email=email,
                    role=role,
                    salary=salary,
                )
                db.session.add(new_employee)
                db.session.commit()
                return jsonify({"message": "Employee added successfully!"}), 201

        elif request.method == "GET":
            employeedata = EmployeeData.query.all();
            if not employeedata:
                return jsonify([]), 200;
            return([e.to_dict() for e in employeedata]), 200

        elif request.method == "PATCH":
            data = request.get_json()
            name = data.get("name")
            employee = EmployeeData.query.filter_by(name=name).first()
            if not employee:
                return jsonify({"message": "Employee does not exist!"}), 404
            if "name" in data:
                employee.name = data["name"]
            if "phone_number" in data:
                employee.phone_number = data["phone_number"]
            if "email" in data:
                employee.email = data["email"]
            if "role" in data:
                employee.role = data["role"]
            if "salary" in data:
                employee.salary = data["salary"]
            db.session.commit()
            return jsonify({"message": "Employee data updated sucessfully!"})

    @app.route("/profits", methods=["POST"])
    def calculate_and_store_profit():
        data = request.get_json()
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        
        try:
            start_date = datetime.strptime(start_date, "%m/%d/%Y").date()
            end_date = datetime.strptime(end_date, "%m/%d/%Y").date()
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid date format, use MM/DD/YYYY"}), 400

        include_salaries = data.get("include_salaries", True)
        include_expenses = data.get("include_expenses", True)
        include_transport = data.get("include_transport", True)

        if not start_date or not end_date:
            return jsonify({"error": "start_date and end_date are required"}), 400

        total_sales = (
            db.session.query(func.sum(Sales.final_amount))
            .filter(Sales.date.between(start_date, end_date))
            .scalar()
            or 0
        )

        total_expenses = 0
        if include_expenses:
            total_expenses = (
                db.session.query(func.sum(Expenses.amount_spent))
                .filter(Expenses.date.between(start_date, end_date))
                .scalar()
                or 0
            )

        total_salaries = 0
        if include_salaries:
            total_salaries = db.session.query(func.sum(EmployeeData.salary)).scalar() or 0

        total_transport = 0
        if include_transport:
            total_transport = (
                db.session.query(func.sum(Sales.transport_costs))
                .filter(Sales.date.between(start_date, end_date))
                .scalar()
                or 0
            )

        profit_value = total_sales - (total_expenses + total_salaries + total_transport)

        profit_record = Profit(
            start_date=start_date,
            end_date=end_date,
            total_sales=total_sales,
            total_expenses=total_expenses + total_transport,
            total_salaries=total_salaries,
            profit=profit_value,
        )
        db.session.add(profit_record)
        db.session.commit()
        return jsonify(profit_record.to_dict()), 201

    @app.route("/profits", methods=["GET"])
    def get_profits():
        profits = Profit.query.all()
        return jsonify([p.to_dict() for p in profits])

    @app.route("/profits/<int:profit_id>", methods=["GET"])
    def get_profit(profit_id):
        profit = Profit.query.get_or_404(profit_id)
        return jsonify(profit.to_dict())

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
    