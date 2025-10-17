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
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True)
 
    @app.route("/signup", methods=["POST"])
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

    # ------------------- LOGIN -------------------
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

    @app.route("/batch", methods=["POST", "GET"])
    def batch():
        if request.method == "POST":
            data = request.get_json()
            batch_name = data.get("batch_name")
            breed = data.get("breed")
            acquisition_date_str = data.get("acquisition_date")

            if not acquisition_date_str:
                return jsonify({"message": "Acquisition date is required"}), 400

            try:
                acquisition_date = datetime.strptime(acquisition_date_str, "%Y-%m-%d").date()
            except ValueError:
                try:
                    acquisition_date = datetime.strptime(acquisition_date_str, "%m/%d/%Y").date()
                except ValueError:
                    return jsonify({"message": "Invalid date format, use YYYY-MM-DD or MM/DD/YYYY"}), 400

            new_batch = Batch(
                batch_name=batch_name,
                breed=breed,
                acquisition_date=acquisition_date,
                initial_number=data.get("initial_number"),
                current_number=data.get("current_number"),
                status=data.get("status"),
            )
            db.session.add(new_batch)
            db.session.commit()
            return jsonify({"message": "Batch created successfully"})

        elif request.method == "GET":
            batches = Batch.query.all()
            if not batches:
                return jsonify([]), 200
            return jsonify([b.to_dict() for b in batches]), 200
        
    @app.route("/batches/<int:id>", methods=["PATCH", "DELETE"])
    def batches(id):
        if request.method == "PATCH":
            data = request.get_json()
            batch_id= data.get("id")
            
            batch = db.session.get(Batch, id)
            if not batch:
                return jsonify({"message": "Batch not found!"}), 404
            
            for field in ["batch_name", "breed", "acquisition_date", "initial_number", "current_number", "status"]:
                if field in data:
                    value = data[field]
                    if field  == "acquisition_date" and isinstance(value, str):
                        try:
                            value = datetime.strptime(value, "%Y-%m-%d").date()
                        except ValueError:
                            try:
                                value = datetime.strptime(value, "%m/%d/%Y").date()
                            except ValueError:
                                return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400
                    setattr(batch, field, value)

            db.session.commit()
            return jsonify({"message": "Batch updated successfully!"})

        elif request.method == "DELETE":
            data = request.get_json()
            batch_id= data.get("id")
            
            if not batch_id:
                return jsonify({"message": "Please provide batch_id"}), 400
            
            batch = db.session.get(Batch, id)
            
            if not batch:
                return jsonify({"message": f"No batch found with name {batch_id}"}), 404

            db.session.delete(batch)
            db.session.commit()
            return jsonify({"message": "Batch deleted successfully"}), 200

    # ------------------- EGGS PRODUCTION -------------------
    @app.route("/eggsproduction", methods=["POST", "GET"])
    def eggsproduction():
        if request.method == "POST":
            data = request.get_json()
            batch_id = data.get("batch_id")
            eggs_collected = int(data.get("eggs_collected", 0))
            broken_eggs = int(data.get("broken_eggs", 0))
            remarks = data.get("remarks")
            date_str = data.get("date")

            try:
                date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                try:
                    date = datetime.strptime(date_str, "%m/%d/%Y").date()
                except ValueError:
                    return jsonify({"message": "Invalid date format, use YYYY-MM-DD or MM/DD/YYYY"}), 400

            batch = Batch.query.filter_by(id=batch_id).first()
            if not batch:
                return jsonify({"message": "There is no batch with that ID"}), 404

            remaining_eggs = eggs_collected - broken_eggs

            prev_row = (
                EggProduction.query.filter_by(batch_id=batch_id)
                .order_by(EggProduction.date.desc())
                .first()
            )

            total_eggs = remaining_eggs + (prev_row.extra_eggs if prev_row else 0)
            quantity_in_crates = total_eggs // 30
            extra_eggs = total_eggs % 30

            stock = Stock.query.first()
            if not stock:
                stock = Stock(crates_in_store=0)
                db.session.add(stock)

            stock.crates_in_store += quantity_in_crates

            new_eggs = EggProduction(
                batch_id=batch_id,
                date=date,
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
            eggs_data = EggProduction.query.all()
            if not eggs_data:
                return jsonify([]), 200
            return jsonify([e.to_dict() for e in eggs_data]), 200

    @app.route("/eggsproduct/<int:id>", methods=["PATCH", "DELETE"])
    def eggsproduct(id):
        if request.method == "PATCH":
            data = request.get_json()
            egg_id = data.get("id")
            
            eggs_col = db.session.get(EggProduction, egg_id)
            if not eggs_col:
                return jsonify({"message": "No collection info on that id!"}), 404
            
            for field in ["date", "eggs_collected", "broken_eggs", "remarks"]:
                if field in data:
                    value = data[field]
                    if field  == "date" and isinstance(value, str):
                        try:
                            value = datetime.strptime(value, "%Y-%m-%d").date()
                        except ValueError:
                            try:
                                value = datetime.strptime(value, "%m/%d/%Y").date()
                            except ValueError:
                                return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400
                    setattr(eggs_col, field, value)
            
            db.session.commit()
            return jsonify({"message": "Data updated successfully!"}), 200
        
        elif request.method == "DELETE":
            data = request.get_json()
            egg_id = data.get("id")
            
            if not egg_id:
                return jsonify({"Enter ID!"})
            
            egg_col = db.session.get(EggProduction, egg_id)
            if not egg_col:
                return ({"message": "No Eggs collection data!"})
            
            db.session.delete(egg_col)
            db.session.commit()
            return jsonify({"message": "Deleted successfully"})

    # ------------------- SALES -------------------
    @app.route("/sales", methods=["POST", "GET"])
    def sales():
        if request.method == "POST":
            data = request.get_json()
            date_str = data.get("date")

            if date_str:
                try:
                    date = datetime.strptime(date_str, "%Y-%m-%d").date()
                except ValueError:
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
            final_amount = selling_price

            stock = Stock.query.first()
            if stock:
                stock.crates_in_store -= quantity_in_crates
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

    @app.route("/sale/<int:id>", methods=["PATCH", "DELETE"])
    def sale(id):
        if request.method == "PATCH":
            data = request.get_json()
            sale_id = data.get("id")

            sale = db.session.get(Sales, sale_id)
            if not sale:
                return jsonify({"message": "No sale of that date"}), 404

            for field in ["date", "buyer_name", "quantity_in_crates", "price_per_tray", "transport_costs"]:
                if field in data:
                    value = data[field]
                    if field  == "date" and isinstance(value, str):
                        try:
                            value = datetime.strptime(value, "%Y-%m-%d").date()
                        except ValueError:
                            try:
                                value = datetime.strptime(value, "%m/%d/%Y").date()
                            except ValueError:
                                return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400
                    setattr(sale, field, value)

            db.session.commit()
            return jsonify({"message": "Sale updated successfully"}), 200
        
        elif request.method == "DELETE":
            data = request.get_json()
            sale_id = data.get("id")
            
            if not sale_id:
                return jsonify({"message": "ID required"}), 400
            
            sale = db.session.get(Sales, sale_id)
            if not sale:
                return jsonify({"message": "No sale"}), 404
            
            db.session.delete(sale)
            db.session.commit()
            return jsonify({"message": "Deleted Successfully"})
        
    @app.route("/stock", methods=["GET"])
    def get_stock():
        stock = Stock.query.all()
        if not stock:
            return jsonify([]), 200
        return jsonify([s.to_dict() for s in stock]), 200

    @app.route("/expenses", methods=["POST", "GET"])
    def expenses():
        if request.method == "POST":
            data = request.get_json()
            date_str = data.get("date")

            if date_str:
                try:
                    date = datetime.strptime(date_str, "%Y-%m-%d").date()
                except ValueError:
                    try:
                        date = datetime.strptime(date_str, "%m/%d/%Y").date()
                    except ValueError:
                        return jsonify({"message": "Invalid date format, use YYYY-MM-DD or MM/DD/YYYY"}), 400
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
            return jsonify({"message": "Expense added successfully!", "id": new_expense.id}), 201

        elif request.method == "GET":
            expenses = Expenses.query.all()
            if not expenses:
                return jsonify([]), 200
            return jsonify([e.to_dict() for e in expenses]), 200
        
    @app.route("/expense/<int:id>", methods=["PATCH", "DELETE"])
    def expense(id):
        if request.method == "PATCH":
            data = request.get_json()
            expense_id = data.get("id")

            if not expense_id:
                return jsonify({"message": "Expense ID is required"}), 400

            expense = Expenses.query.get(expense_id)
            if not expense:
                return jsonify({"message": "Expense not found"}), 404

            for field in ["date", "category", "amount_spent", "description"]:
                if field in data:
                    if field == "date" and isinstance(data["date"], str):
                        try:
                            data["date"] = datetime.strptime(data["date"], "%Y-%m-%d").date()
                        except ValueError:
                            try:
                                data["date"] = datetime.strptime(data["date"], "%m/%d/%Y").date()
                            except ValueError:
                                return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400
                                                            
                    setattr(expense, field, data[field])

            db.session.commit()
            return jsonify({"message": "Expense updated successfully!"}), 200

        elif request.method == "DELETE":
            data = request.get_json()
            expense_id = data.get("id")

            if not expense_id:
                return jsonify({"message": "Expense ID is required"}), 400

            expense = db.query.get(Expenses, expense_id)
            if not expense:
                return jsonify({"message": f"No expense found with id {expense_id}"}), 404

            db.session.delete(expense)
            db.session.commit()
            return jsonify({"message": f"Expense with id {expense_id} deleted successfully!"}), 200

    # ------------------- EMPLOYEE DATA -------------------
    @app.route("/employeedata", methods=["POST", "PATCH", "GET", "DELETE"])
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
                return jsonify({"message": "Employee already exists"}), 400

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
            employees = EmployeeData.query.all()
            if not employees:
                return jsonify([]), 200
            return jsonify([e.to_dict() for e in employees]), 200

        elif request.method == "PATCH":
            data = request.get_json()
            emp_id = data.get("id")

            if not emp_id:
                return jsonify({"message": "Employee ID required"}), 400

            employee = EmployeeData.query.get(emp_id)
            if not employee:
                return jsonify({"message": "Employee not found"}), 404

            for field in ["name", "phone_number", "email", "role", "salary"]:
                if field in data:
                    setattr(employee, field, data[field])

            db.session.commit()
            return jsonify({"message": "Employee updated successfully!"}), 200
        
        elif request.method == "DELETE":
            data = request.get_json()
            emp_id = data.get("id")
            
            if not emp_id:
                return jsonify({"message": "Enter ID!"}), 400
            
            employee = EmployeeData.query.get(emp_id)
            if not employee:
                return jsonify({"message": "No eployee with that id"})
            
            db.session.delete(employee)
            db.session.commit()
            return jsonify({"Employee deleted successfully"})

    # ------------------- PROFITS -------------------
    @app.route("/profits", methods=["POST"])
    def calculate_and_store_profit():
        data = request.get_json()
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except (TypeError, ValueError):
            try:
                start_date = datetime.strptime(start_date, "%m/%d/%Y").date()
                end_date = datetime.strptime(end_date, "%m/%d/%Y").date()
            except Exception:
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

        total_expenses = (
            db.session.query(func.sum(Expenses.amount_spent))
            .filter(Expenses.date.between(start_date, end_date))
            .scalar()
            or 0
        ) if include_expenses else 0

        total_salaries = (
            db.session.query(func.sum(EmployeeData.salary)).scalar() or 0
        ) if include_salaries else 0

        total_transport = (
            db.session.query(func.sum(Sales.transport_costs))
            .filter(Sales.date.between(start_date, end_date))
            .scalar()
            or 0
        ) if include_transport else 0

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
        return jsonify([p.to_dict() for p in profits]), 200

    @app.route("/profits/<int:profit_id>", methods=["GET"])
    def get_profit(profit_id):
        profit = Profit.query.get_or_404(profit_id)
        return jsonify(profit.to_dict()), 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
