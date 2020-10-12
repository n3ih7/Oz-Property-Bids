from flask_login import UserMixin
from . import db


class USER_INFO(db.Model, UserMixin):
    __tablename__ = 'USER_INFO'
    email = db.Column('email', db.Text, primary_key=True)
    password = db.Column('password', db.Text)
    firstname = db.Column('firstname', db.Text)
    lastname = db.Column('lastname', db.Text)
    birthyear = db.Column('birthyear', db.INTEGER)
    gender = db.Column('gender', db.INTEGER)
    phone = db.Column('phone', db.Text)

    def get_id(self):
        return self.email
