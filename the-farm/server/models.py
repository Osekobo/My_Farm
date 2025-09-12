from extensions import db
from datetime import datetime
import pytz

kenya_tz = pytz.timezone("Africa/Nairobi")

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String, default='user')
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)

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
    __tablename__ = "batch"

    id = db.Column(db.Integer, primary_key=True)
    batch_name = db.Column(db.String, nullable=False)
    breed = db.Column(db.String, nullable=False)
    acquisition_date = db.Column(db.Date, nullable=False, default=lambda: datetime.now(kenya_tz).date())
    initial_number = db.Column(db.Integer, nullable=False)
    current_number = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False, default="Active")

    egg_productions = db.relationship("EggProduction", back_populates="batch", cascade="all, delete-orphan")

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
    __tablename__ = "egg_production"

    id = db.Column(db.Integer, primary_key=True)
    batch_id = db.Column(db.Integer, db.ForeignKey("batch.id", name="fk_eggproduction_batch_id"), nullable=False)
    date = db.Column(db.Date, nullable=False, default=lambda: datetime.now(kenya_tz).date())
    eggs_collected = db.Column(db.Integer, nullable=False)
    broken_eggs = db.Column(db.Integer, nullable=False)
    remaining_eggs = db.Column(db.Integer, nullable=False)
    quantity_in_crates = db.Column(db.Integer, nullable=False)
    remarks = db.Column(db.String, nullable=False)

    batch = db.relationship("Batch", back_populates="egg_productions")

    def to_dict(self):
        return {
            'id': self.id,
            'batch_id': self.batch_id,
            'date': self.date,
            'eggs_collected': self.eggs_collected,
            'broken_eggs': self.broken_eggs,
            'remaining_eggs': self.remaining_eggs,
            'quantity_in_crates': self.quantity_in_crates,
            'remarks': self.remarks
        }


class Sales(db.Model):
    __tablename__ = "sales"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, default=lambda: datetime.now(kenya_tz).date())
    buyer_name = db.Column(db.String, nullable=False)
    quantity_in_crates = db.Column(db.Integer, nullable=False)
    price_per_tray = db.Column(db.Numeric(12, 2), nullable=False)
    transport_costs = db.Column(db.Numeric(12, 2), nullable=False)
    total_from_sales = db.Column(db.Numeric(12, 2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'buyer_name': self.buyer_name,
            'quantity_in_crates': self.quantity_in_crates,
            'price_per_tray': self.price_per_tray,
            'transport_costs': self.transport_costs,
            'total_from_sales': self.total_from_sales
        }


class Expenses(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, default=lambda: datetime.now(kenya_tz).date())
    category = db.Column(db.String, nullable=False)
    amount_spent = db.Column(db.Numeric(12, 2), nullable=False)
    description = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'category': self.category,
            'amount_spent': self.amount_spent,
            'description': self.description
        }


class EmployeeData(db.Model): 
    __tablename__ = "employee_data"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    salary = db.Column(db.Numeric(12, 2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone_number': self.phone_number,
            'email': self.email,
            'salary': self.salary
        }
