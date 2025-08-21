from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String, default = 'user')
    username = db.Column(db.String, unique = True, nullable = False)
    email = db.Column(db.String, unique = True, nullable = False)
    phone_number = db.Column(db.Integer, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False)

    def to_dict(self):
        return {
            'id': self.id,
            'role': self.role,
            'username': self.username,
            'email': self.email,
            'phone_number': self.phone_number,
            'password': self.phone_number
        }
    
class batch(db.model):
    id = db.Column(db.int, primary_key = True)
    batch_name = db.Column(db.String, unique = True, nullable = False)
    breed = db.Column(db.String, unique = True, nullable = False)
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