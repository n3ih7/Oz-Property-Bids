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
    seller_flag = db.Column('seller_flag', db.Text)


class PROPERTY_INFO(db.Model):
    __tablename__ = 'PROPERTY_INFO'
    propertyId = db.Column('propertyid', db.INTEGER, primary_key=True)
    sellerId = db.Column('sellerid', db.INTEGER)
    propertyType = db.Column('propertytype', db.Text)
    unitNumber = db.Column('unitnumber', db.Text)
    streetAddress = db.Column('streetaddress', db.Text)
    suburb = db.Column('suburb', db.Text)
    state = db.Column('state', db.Text)
    postcode = db.Column('postcode', db.Text)
    beds = db.Column('beds', db.Text)
    baths = db.Column('baths', db.Text)
    parkingSpace = db.Column('carspots', db.Text)
    landSize = db.Column('landsize', db.Text)
    reservePrice = db.Column('reserveprice', db.Text)
    images = db.Column('images', db.Text)
    propertyPostDate = db.Column('accessdate', db.Text)
    auction_start = db.Column('auction_start', db.Text)
    auction_end = db.Column('auction_end', db.Text)
    intro_title = db.Column('intro_title', db.Text)
    intro_text = db.Column('intro_text', db.Text)


class PROPERTY_BID_RELATION(db.Model):
    __tablename__ = 'PROPERTY_BID_RELATION'
    bidActivityId = db.Column('bid_activity_id', db.INTEGER, primary_key=True)
    propertyId = db.Column('propertyid', db.INTEGER)
    winnerId = db.Column('winnerid', db.INTEGER)
    reserve_price = db.Column('reserve_price', db.Text)
    final_price = db.Column('final_price', db.Text)
    start_time = db.Column('start_time', db.Text)
    expected_finish_time = db.Column('expected_finish_time', db.Text)
    bank_transfer_flag = db.Column('bank_transfer_flag', db.Text)
    bsb = db.Column('bsb', db.Text)
    acc_number = db.Column('accnumber', db.Text)
    cheque_flag = db.Column('cheque_flag', db.Text)
    # cheque_name = db.Column('cheque_name', db.Text)
    card_flag = db.Column('card_flag', db.Text)
    email_flag = db.Column('email_flag', db.Text)


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


class BID_ACTIVITY(db.Model):
    __tablename__ = 'BID_ACTIVITY'
    lineId = db.Column('lineid', db.INTEGER, primary_key=True)
    uid = db.Column('uid', db.INTEGER)
    bidActivityId = db.Column('bid_activity_id', db.INTEGER)
    offerPrice = db.Column('offer_price', db.INTEGER)
    bidPlaceTime = db.Column('bid_place_time', db.Text)
    payment_method_as_buyer = db.Column('payment_method_as_buyer', db.Text)
    initial_bid_flag = db.Column('initial_bid_flag', db.Text)
    cardholderName = db.Column('cardholdername', db.Text)
    cardNumber = db.Column('cardnumber', db.Text)
    cardExp = db.Column('cardexp', db.Text)
    cardCVV = db.Column('cardcv', db.Text)
