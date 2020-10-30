import base64
import datetime
import json
import secrets
import time
import uuid
from random import randint

from flask import request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

from . import db, create_app
from .models import USER_INFO, USER_INFO_EXTENDED, MOVEMENT_TRACKING, PROPERTY_INFO

app = create_app()
SQLAlchemy(app)


def get_new_id():
    n = randint(10000, 99999)
    check_temp_uid = USER_INFO.query.filter_by(uid=n).first()
    if check_temp_uid:
        get_new_id()
    else:
        return n


@app.route('/login', methods=['POST'])
def login():
    try:
        jsonContent = request.get_json()
        try:
            email = jsonContent['email']
            password = jsonContent['password']
            user = USER_INFO.query.filter_by(email=email).first()
            if not user or not check_password_hash(user.password, password):
                return jsonify(error='Please check your login details and try again, login failed'), 401
            user.login_status = '1'
            user.curr_token = str(secrets.token_hex(32))
            user.expire_time = str(time.time() + 7 * 24 * 3600)
            db.session.merge(user)
            db.session.commit()
            user_ext = USER_INFO_EXTENDED.query.filter_by(uid=user.uid).first()
            user_type = ''
            if user_ext.bidder_flag == "0" and user_ext.seller_flag == "1":
                user_type = 'seller'
            if user_ext.bidder_flag == "1" and user_ext.seller_flag == "0":
                user_type = 'bidder'
            return jsonify(token=user.curr_token, expire_time=user.expire_time, user_type=user_type), 200
        except KeyError:
            return jsonify(error="Expected attributes not received, login failed"), 400
    except ValueError:
        return jsonify(error="No JSON object could be decoded, signup failed"), 400


@app.route('/logout', methods=['GET'])
def logout():
    try:
        tk = str(request.headers['Authorization']).split(' ')[1]
        user = USER_INFO.query.filter_by(curr_token=tk).first()
        if user:
            user.login_status = '0'
            user.curr_token = ''
            user.expire_time = str(time.time())
            db.session.merge(user)
            db.session.commit()
            return jsonify(msg="Logout successful"), 200
        else:
            return jsonify(error="Token not valid, nothing to be changed"), 400
    except IndexError:
        return jsonify(error="Token format not valid, nothing to be changed"), 400
    except KeyError:
        return jsonify(warning="Token not received, but you can continue"), 400


@app.route('/signup', methods=['POST'])
def signup():
    try:
        jsonContent = request.get_json()
        try:
            user = USER_INFO.query.filter_by(email=jsonContent['email']).first()
            if user:
                return jsonify(
                    error="Email address already exists, signup failed"), 409
            else:
                uid = get_new_id()
                tk = str(secrets.token_hex(32))
                et = str(time.time() + 7 * 24 * 3600)
                nu = USER_INFO(uid=uid,
                               email=jsonContent['email'],
                               password=generate_password_hash(jsonContent['password'], method='sha256'),
                               login_status='1',
                               curr_token=tk,
                               expire_time=et
                               )
                nu_ext = USER_INFO_EXTENDED(uid=uid,
                                            firstname=jsonContent['firstname'],
                                            lastname=jsonContent['lastname'],
                                            phone=jsonContent['phone'],
                                            address=jsonContent['address_line_1'] + jsonContent['address_line_2'],
                                            suburb=jsonContent['city'],
                                            state=jsonContent['state'],
                                            postcode=jsonContent['postcode'],
                                            bidder_flag=jsonContent['bidder_flag'],
                                            bsb=jsonContent['bsb'],
                                            acc_number=jsonContent['acc_number'],
                                            seller_flag=jsonContent['seller_flag']
                                            )
                db.session.add(nu)
                db.session.add(nu_ext)
                db.session.commit()
                return jsonify(token=tk, expire_time=et), 200
        except KeyError:
            return jsonify(error="Expected attributes not received, signup failed"), 400
    except ValueError:
        return jsonify(error="No JSON object could be decoded, signup failed"), 400


@app.route('/profile_update', methods=['PUT'])
def profile_update():
    try:
        tk = str(request.headers['Authorization']).split(' ')[1]
        user = USER_INFO.query.filter_by(curr_token=tk).first()

        if user and user.login_status == '1' and time.time() < float(user.expire_time):
            uid = user.uid
            try:
                user_ext = USER_INFO_EXTENDED.query.filter_by(uid=uid).first()
                jsonContent = request.get_json()
                addr_1 = ''
                addr_2 = ''
                addr_change_flag = '0'
                try:
                    for k, v in jsonContent.items():
                        if k == 'old_password':
                            continue
                        elif k == 'email':
                            user.email = v
                        elif k == 'address_line_1':
                            addr_1 = v
                            addr_change_flag = '1'
                        elif k == 'address_line_2':
                            addr_2 = v
                            addr_change_flag = '1'
                        elif k == 'new_password':
                            if not check_password_hash(user.password, jsonContent['old_password']):
                                return jsonify(
                                    error='Please check your old password old_password, profile update failed'), 401
                            else:
                                user.password = generate_password_hash(v, method='sha256')
                        elif k == 'new_bsb':
                            if not check_password_hash(user.password, jsonContent['old_password']):
                                return jsonify(
                                    error='Please check your old password old_password, profile update failed'), 401
                            else:
                                user_ext.bsb = v
                        elif k == 'new_acc_number':
                            if not check_password_hash(user.password, jsonContent['old_password']):
                                return jsonify(
                                    error='Please check your old password old_password, profile update failed'), 401
                            else:
                                user_ext.acc_number = v
                        elif k == 'firstname':
                            user_ext.firstname = v
                        elif k == 'lastname':
                            user_ext.lastname = v
                        elif k == 'phone':
                            user_ext.phone = v
                        elif k == 'city':
                            user_ext.suburb = v
                        elif k == 'state':
                            user_ext.state = v
                        elif k == 'postcode':
                            user_ext.postcode = v
                        elif k == 'bidder_flag':
                            user_ext.bidder_flag = v
                        elif k == 'seller_flag':
                            user_ext.seller_flag = v
                        else:
                            return jsonify(error="Unexpected attributes received, nothing to be changed"), 400

                    if addr_change_flag == '1':
                        user_ext.address = str(addr_1) + str(addr_2)

                    db.session.merge(user)
                    db.session.merge(user_ext)
                    db.session.commit()

                    return jsonify(msg="Profile update successful"), 200

                except KeyError:
                    return jsonify(error="Expected attribute old_password not received, nothing to be changed"), 401
            except ValueError:
                return jsonify(error="No JSON object could be decoded, nothing to be changed"), 400
        else:
            return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
    except IndexError:
        return jsonify(error="Token format not valid, nothing to be changed"), 401
    except KeyError:
        return jsonify(error="Token not received, nothing to be changed"), 401


@app.route('/search', methods=['GET'])
def property_search():
    if 'keyword' not in request.args:
        return jsonify(message="expected conditions not received", status="search failed"), 400
    else:
        # Record search history
        # mov = MOVEMENT_TRACKING(movementId=randint(100000000, 999999999))
        # new_cookies_CID = str(uuid.uuid4())
        #
        # if 'Authorization' in request.headers:
        #     try:
        #         tk = str(request.headers['Authorization']).split(' ')[1]
        #         user = USER_INFO.query.filter_by(curr_token=tk).first()
        #         if user and user.login_status == '1' and time.time() < float(user.expire_time):
        #             mov.email = user.email
        #         else:
        #             return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
        #     except IndexError:
        #         return jsonify(error="Token format not valid, user not found"), 401
        #     except KeyError:
        #         return jsonify(error="Token not received"), 401
        #
        # if 'CID' not in request.cookies:
        #     mov.cid = new_cookies_CID
        # else:
        #     mov.cid = request.cookies['CID']
        # mov.accessDate = time.strftime("%H:%M:%S %d-%b-%Y", time.localtime())
        # mov.searchKeyword = request.args.get('keyword')
        # if 'type' in request.args:
        #     mov.propertyType = request.args.get('type')
        # if 'bedrooms' in request.args:
        #     mov.beds = int(request.args.get('bedroom'))
        # if 'bathrooms' in request.args:
        #     mov.baths = int(request.args.get('bathroom'))
        # if 'minprice' in request.args:
        #     mov.minPrice = int(request.args.get('minprice'))
        # if 'maxprice' in request.args:
        #     mov.maxPrice = int(request.args.get('maxprice'))
        # if 'minlandsize' in request.args:
        #     mov.minLandSize = int(request.args.get('minlandsize'))
        #
        # db.session.add(mov)
        # db.session.commit()

        searchKeyword = request.args.get('keyword')

        req_filter_dict = {
            "beds": str(request.args.get('beds')),
            "baths": str(request.args.get('baths')),
            "parkingSpace": str(request.args.get('carspots')),
        }

        for i in list(req_filter_dict):
            if req_filter_dict[i] == 'Any':
                del req_filter_dict[i]

        more_than_three = []

        for i in list(req_filter_dict):
            if len(req_filter_dict[i]) > 1:
                more_than_three.append(i)
                del req_filter_dict[i]

        auction_start = request.args.get('auction_start')
        auction_end = request.args.get('auction_end')

        # Query with the filters
        query_res = db.session.query(PROPERTY_INFO).filter_by(**req_filter_dict) \
            .filter(PROPERTY_INFO.auction_start >= auction_start) \
            .filter(PROPERTY_INFO.auction_end <= auction_end) \
            .filter_by(postcode=int(searchKeyword))

        if 'beds' in more_than_three:
            query_res = query_res.filter(PROPERTY_INFO.beds > 3)
        if 'baths' in more_than_three:
            query_res = query_res.filter(PROPERTY_INFO.baths > 3)
        if 'parkingSpace' in more_than_three:
            query_res = query_res.filter(PROPERTY_INFO.parkingSpace > 3)

        # Return result to front-end
        result_list = []
        if query_res:
            for i in query_res:
                result_dict = {
                    "propertyId": i.propertyId,
                    "propertyType": i.propertyType,
                    "unitNumber": i.unitNumber,
                    "streetAddress": i.streetAddress,
                    "city": i.suburb,
                    "state": i.state,
                    "postcode": i.postcode,
                    "beds": i.beds,
                    "baths": i.baths,
                    "parkingSpace": i.parkingSpace,
                    "landSize": i.landSize,
                    # "sellerEmail": i.sellerEmail,
                    # "introTitle": i.introTitle,
                    # "introDetails": i.introDetails,
                    "startPrice": i.startPrice,
                    "front_image": i.front_image,
                    "auction_start": i.auction_start
                    # "auction_end": i.auction_end,
                    # "compare_addr": i.compare_addr
                }
                result_list.append(result_dict)

            if not result_list:
                return jsonify(message="nothing found", status="failed"), 404
            else:
                return jsonify(resp=result_list), 200
        else:
            return jsonify(message="nothing found", status="failed"), 404
#
#
# @app.route('/sell', methods=['POST'])
# def property_post():
#     req = request.get_json()
#     req_json_check = json.loads(str(req).replace("\'", "\""))
#     new_pp = PROPERTY_INFO(propertyId=randint(100000000, 999999999))
#     new_pp.sellerEmail = current_user.email
#
#     if "unitNumber" in req_json_check:
#         new_pp.unitNumber = req['unitNumber']
#
#     try:
#         new_pp.propertyType = req['propertyType']
#         new_pp.streetAddress = req['streetAddress']
#         new_pp.suburb = req['suburb']
#         new_pp.state = req['state']
#         new_pp.postcode = int(req['postcode'])
#         new_pp.beds = int(req['beds'])
#         new_pp.baths = int(req['baths'])
#         new_pp.parkingSpace = int(req['parkingSpace'])
#         new_pp.landSize = int(req['landSize'])
#         new_pp.introTitle = req['introTitle']
#         new_pp.introDetails = req['introDetails']
#         new_pp.startPrice = int(req['startprice'])
#         new_pp.accessDate = time.strftime("%H:%M:%S %d-%b-%Y", time.localtime())
#
#         db.session.add(new_pp)
#         db.session.commit()
#         return jsonify(message="Your property has been posted", status="post successful"), 200
#
#     except KeyError:
#         return jsonify(message="expected attributes not received", status="post failed"), 400
