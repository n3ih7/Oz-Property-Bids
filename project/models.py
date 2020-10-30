from . import db


class USER_INFO(db.Model):
    __tablename__ = 'USER_INFO'
    uid = db.Column('uid', db.INTEGER, primary_key=True)
    email = db.Column('email', db.Text)
    password = db.Column('password', db.Text)
    login_status = db.Column('login_status', db.Text)
    curr_token = db.Column('curr_token', db.Text)
    expire_time = db.Column('expire_time', db.Text)


class USER_INFO_EXTENDED(db.Model):
    __tablename__ = 'USER_INFO_EXTENDED'
    uid = db.Column('uid', db.INTEGER, primary_key=True)
    firstname = db.Column('firstname', db.Text)
    lastname = db.Column('lastname', db.Text)
    phone = db.Column('phone', db.Text)
    address = db.Column('address', db.Text)
    suburb = db.Column('suburb', db.Text)
    state = db.Column('state', db.Text)
    postcode = db.Column('postcode', db.Text)
    bidder_flag = db.Column('bidder_flag', db.Text)
    bsb = db.Column('bsb', db.Text)
    acc_number = db.Column('accnumber', db.Text)
    seller_flag = db.Column('seller_flag', db.Text)


class PROPERTY_INFO(db.Model):
    __tablename__ = 'PROPERTY_INFO'
    propertyId = db.Column('propertyid', db.INTEGER, primary_key=True)
    sellerId = db.Column('sellerid', db.Text)
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
    startPrice = db.Column('startprice', db.INTEGER)
    front_image = db.Column('image', db.Text)
    propertyPostDate = db.Column('accessdate', db.Text)
    auction_start = db.Column('auction_start', db.Text)
    auction_end = db.Column('auction_end', db.Text)
    compare_addr = db.Column('compare_addr', db.Text)


class PROPERTY_BID_EXTENDED(db.Model):
    __tablename__ = 'PROPERTY_BID_EXTENDED'
    propertyId = db.Column('propertyid', db.INTEGER, primary_key=True)
    introTitle = db.Column('introtitle', db.Text)
    introDetails = db.Column('introdetails', db.Text)


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
