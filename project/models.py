from flask_login import UserMixin
from . import db


class USER_INFO(db.Model, UserMixin):
    __tablename__ = 'USER_INFO'
    email = db.Column('email', db.Text, primary_key=True)
    password = db.Column('password', db.Text)

    def get_id(self):
        return self.email


class USER_INFO_EXTENDED(db.Model, UserMixin):
    __tablename__ = 'USER_INFO_EXTENDED'
    email = db.Column('email', db.Text, primary_key=True)
    firstname = db.Column('firstname', db.Text)
    lastname = db.Column('lastname', db.Text)
    birthYear = db.Column('birthyear', db.INTEGER)
    gender = db.Column('gender', db.Text)
    phone = db.Column('phone', db.Text)
    bidderTag = db.Column('biddertag', db.INTEGER)
    bsb = db.Column('bsb', db.INTEGER)
    accNumber = db.Column('accnumber', db.INTEGER)
    initialBid = db.Column('basebid', db.INTEGER)

    def get_id(self):
        return self.email
