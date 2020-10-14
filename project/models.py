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


class PROPERTY_INFO(db.Model):
    __tablename__ = 'PROPERTY_INFO'
    propertyId = db.Column('propertyid', db.INTEGER, primary_key=True)
    propertyType = db.Column('propertytype', db.Text)
    unitNumber = db.Column('unitnumber', db.Text)
    streetAddress = db.Column('streetaddress', db.Text)
    suburb = db.Column('suburb', db.Text)
    state = db.Column('state', db.Text)
    postcode = db.Column('postcode', db.INTEGER)
    beds = db.Column('beds', db.INTEGER)
    baths = db.Column('baths', db.INTEGER)
    parkingSpace = db.Column('carspots', db.INTEGER)
    landSize = db.Column('landsize', db.INTEGER)
    sellerEmail = db.Column('selleremail', db.Text)
    introTitle = db.Column('introtitle', db.Text)
    introDetails = db.Column('introdetails', db.Text)
    startPrice = db.Column('startprice', db.INTEGER)
    image = db.Column('image', db.Text)
    accessDate = db.Column('accessdate', db.Text)


class PROPERTY_BID_EXTENDED(db.Model):
    __tablename__ = 'PROPERTY_BID_EXTENDED'
    propertyId = db.Column('propertyid', db.INTEGER, primary_key=True)
    startPrice = db.Column('startprice', db.INTEGER)
    reservePrice = db.Column('reserveprice', db.INTEGER)
    bidDate = db.Column('biddate', db.Text)


class MOVEMENT_TRACKING(db.Model):
    __tablename__ = 'MOVEMENT_TRACKING'
    movementId = db.Column('moveid', db.INTEGER, primary_key=True)
    email = db.Column('email', db.Text)
    cid = db.Column('cid', db.Text)
    accessDate = db.Column('accessdate', db.Text)
    searchKeyword = db.Column('searchkeyword', db.Text)
    propertyType = db.Column('type', db.Text)
    beds = db.Column('beds', db.INTEGER)
    baths = db.Column('baths', db.INTEGER)
    minPrice = db.Column('minprice', db.INTEGER)
    maxPrice = db.Column('maxprice', db.INTEGER)
    minLandSize = db.Column('minlandsize', db.INTEGER)