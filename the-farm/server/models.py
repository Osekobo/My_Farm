from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pytz
kenya_tz = pytz.timezone("Africa/Nairobi")

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String, default = 'user')
    username = db.Column(db.String, unique = True, nullable = False)
    email = db.Column(db.String, unique = True, nullable = False)
    phone_number = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False)

    def to_dict(self):
        return {
            'id': self.id,
            'role': self.role,
            'username': self.username,
            'email': self.email,
            'phone_number': self.phone_number,
            'password': self.password
        }
    
class Batch(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    batch_name = db.Column(db.String, unique = True, nullable = False)
    breed = db.Column(db.String, nullable = False)
    acquisition_date = db.Column(db.Date, nullable = False)  
    initial_number = db.Column(db.Integer, nullable = False)
    current_number = db.Column(db.Integer, nullable = False)
    status = db.Column(db.String, nullable = False, default = "Active")

    def to_dict(self):
        return {
            'id': self.id,
            'batch_name': self.batch_name,
            'breed': self.breed,
            'acquisition_date': self.acquisition_date,
            'initial_number': self.initial_number,
            'current_number': self.current_number,
            'status': self.status,
        }

class EggProduction(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    batch_id = db.Column(db.Integer, db.ForeignKey('batch.id'), nullable = False)
    date = db.Column(db.Date, nullable = False)
    eggs_collected = db.Column(db.Integer, nullable = False)
    broken_eggs = db.Column(db.Integer, nullable = False)
    remarks = db.Column(db.String, nullable = False)

    def to_dict(self):
        return{
            'id': self.id,
            'batch_id': self.batch_id,
            'date': self.date,
            'eggs_collected': self.eggs_collected,
            'broken_eggs': self.broken_eggs,
            'remarks': self.remarks
        }
    
class Sales(db.Model):
    id = db.Column(db.Integer, nullable = False, primary_key = True)
    date = db.Column(db.Date, nullable = False)
    buyer_name = db.Column(db.String, nullable = False)
    quantity = db.Column(db.Integer, nullable = False)
    price_per_tray = db.Column(db.Numeric(12, 2), nullable = False)
    transport_costs = db.Column(db.Numeric(12, 2), nullable = False)
    total_from_sales = db.Column(db.Numeric(12, 2), nullable = False)

    def to_dict(self):
        return{
            'id': self.id,
            'date': self.date,
            'buyer_name': self.buyer_name,
            'quantity': self.quantity,
            'price_per_tray': self.price_per_tray,
            'transport_costs': self.transport_costs,
            'total_from_sales': self.total_from_sales
        }

class Expenses(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key = True)
    date = db.Column(db.Date, nullable = False, default = lambda: datetime.now(kenya_tz).date())
    category = db.Column(db.String, nullable = False)
    amount_spent = db.Column(db.Numeric(12, 2), nullable = False)
    description = db.Column(db.String, nullable = False)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'category': self.category,
            'amount_spent': self.amount_spent,
            'description': self.description
        }

class EmployeeData (db.Model): 
    id = db.Column(db.Integer, nullable = False, primary_key = True)
    name = db.Column(db.String, nullable = False)
    phone_number = db.Column(db.String, nullable = False)
    email = db.Column(db.String, nullable = False)
    salary = db.Column(db.Numeric(12, 2), nullable = False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone_number': self.phone_number,
            'email': self.email,
            'salary': self.salary
        }

class Inventory(db.Model):
    id = db.Column(db.Integer, nullable = False, primary_key = True)
    date = db.Column(db.Date, nullable = False, default = lambda: datetime.now(kenya_tz).date())
    total_from_expenses = db.Column(db.Numeric(12, 2), nullable = False)
    total_from_salaries = db.Column(db.Numeric(12, 2), nullable = False)
    total_from_sales = db.Column(db.Numeric(12, 2), nullable = False)
    tax = db.Column(db.Numeric(12, 2), nullable = False)
    grand_totals = db.Column(db.Numeric(12, 2), nullable = False)

    def to_dict(self):
        return {
            'date': self.date,
            'total_from_expenses': self.total_from_expenses,
            'total_from_salaries': self.total_from_salaries,
            'total_from_sales': self.total_from_sales,
            'tax': self.tax,
            'grand_totals': self.grand_totals
        }
