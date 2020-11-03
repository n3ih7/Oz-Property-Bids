import secrets
import time
from random import randint
from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

from . import db, create_app
from .models import USER_INFO, USER_INFO_EXTENDED, PROPERTY_INFO
from .blob import *

app = create_app()
SQLAlchemy(app)


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
            user.expire_time = str(int(time.time() + 7 * 24 * 3600))
            db.session.merge(user)
            db.session.commit()
            user_ext = USER_INFO_EXTENDED.query.filter_by(uid=user.uid).first()
            user_type = ''
            if user_ext.bidder_flag == "0" and user_ext.seller_flag == "1":
                user_type = 'seller'
            if user_ext.bidder_flag == "1" and user_ext.seller_flag == "0":
                user_type = 'bidder'
            return jsonify(token=user.curr_token, expire_time=str(user.expire_time + '000'), user_type=user_type), 200
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
            user.expire_time = str(int(time.time()))
            db.session.merge(user)
            db.session.commit()
            return jsonify(msg="Logout successful"), 200
        else:
            return jsonify(error="Token not valid, nothing changed"), 400
    except IndexError:
        return jsonify(error="Token format not valid, nothing changed"), 400
    except KeyError:
        return jsonify(warning="Token not received, but you may continue"), 400


@app.route('/signup', methods=['POST'])
def signup():
    def get_new_uid():
        n = randint(10000, 99999)
        check_temp_uid = USER_INFO.query.filter_by(uid=n).first()
        if check_temp_uid:
            get_new_uid()
        else:
            return n

    try:
        jsonContent = request.get_json()
        try:
            user = USER_INFO.query.filter_by(email=jsonContent['email']).first()
            if user:
                return jsonify(
                    error="Email address already exists, signup failed"), 409
            else:
                uid = get_new_uid()
                tk = str(secrets.token_hex(32))
                et = str(int(time.time() + 7 * 24 * 3600))
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
                return jsonify(token=tk, expire_time=str(et + '000')), 200
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
                            return jsonify(error="Unexpected attributes received, nothing changed"), 400

                    if addr_change_flag == '1':
                        user_ext.address = str(addr_1) + str(addr_2)

                    db.session.merge(user)
                    db.session.merge(user_ext)
                    db.session.commit()

                    return jsonify(msg="Profile update successful"), 200

                except KeyError:
                    return jsonify(error="Expected attribute old_password not received, nothing changed"), 401
            except ValueError:
                return jsonify(error="No JSON object could be decoded, nothing changed"), 400
        else:
            return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
    except IndexError:
        return jsonify(error="Token format not valid, nothing changed"), 401
    except KeyError:
        return jsonify(error="Token not received, nothing changed"), 401


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
        bedroom_req = ''
        bathroom_req = ''
        carSpots_req = ''
        start_timeStamp = ''
        end_timeStamp = ''

        if 'beds' in request.args and request.args.get('beds') != "" and \
                request.args.get('beds') != "null" and request.args.get('beds') != "Any":
            bedroom_req = request.args.get('beds')
            if bedroom_req[0] == '3':
                bedroom_req = '3'
        if 'baths' in request.args and request.args.get('baths') != "" and \
                request.args.get('baths') != "null" and request.args.get('baths') != "Any":
            bathroom_req = request.args.get('baths')
            if bathroom_req[0] == '3':
                bathroom_req = '3'
        if 'carspots' in request.args and request.args.get('carspots') != "" and \
                request.args.get('carspots') != "null" and request.args.get('carspots') != "Any":
            carSpots_req = request.args.get('carspots')
            if carSpots_req[0] == '3':
                carSpots_req = '3'
        if 'auction_start' in request.args:
            if request.args.get('auction_start'):
                try:
                    if len(request.args.get('auction_start')) == 13:
                        start_timeStamp = request.args.get('auction_start')[0:-3]
                    else:
                        return jsonify(error="Date range length not looks quite right"), 400
                except IndexError:
                    return jsonify(error="Date range format not looks quite right"), 400
        if 'auction_end' in request.args:
            if request.args.get('auction_end'):
                try:
                    if len(request.args.get('auction_end')) == 13:
                        end_timeStamp = request.args.get('auction_end')[0:-3]
                    else:
                        return jsonify(error="Date range length not looks quite right"), 400
                except IndexError:
                    return jsonify(error="Date range format not looks quite right"), 400

        if searchKeyword == '':
            query_res = db.session.query(PROPERTY_INFO)
        else:
            query_res = db.session.query(PROPERTY_INFO).filter_by(postcode=searchKeyword)
        if bedroom_req != '':
            if bedroom_req != '3':
                query_res = query_res.filter_by(beds=bedroom_req)
            else:
                query_res = query_res.filter(PROPERTY_INFO.beds >= 3)
        if bathroom_req != '':
            if bathroom_req != '3':
                query_res = query_res.filter_by(baths=bathroom_req)
            else:
                query_res = query_res.filter(PROPERTY_INFO.baths >= 3)
        if carSpots_req != '':
            if carSpots_req != '3':
                query_res = query_res.filter_by(parkingSpace=carSpots_req)
            else:
                query_res = query_res.filter(PROPERTY_INFO.parkingSpace >= 3)
        if start_timeStamp != '':
            # print(start_timeStamp)
            query_res = query_res.filter(start_timeStamp <= PROPERTY_INFO.auction_start)
        if end_timeStamp != '':
            # print(end_timeStamp)
            query_res = query_res.filter(PROPERTY_INFO.auction_end <= end_timeStamp)

        # upload_blob('1', '3')
        # print(str(query_res.all()))

        result_list = []
        if query_res:
            for i in query_res:
                if i.unitNumber:
                    address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
                else:
                    address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode

                result_dict = {
                    "propertyId": i.propertyId,
                    "propertyType": i.propertyType,
                    "address": address,
                    "city": i.suburb,
                    "baths": i.baths,
                    "parkingSpace": i.parkingSpace,
                    "landSize": i.landSize,
                    "images": i.images,
                    "auction_start": i.auction_start,
                    "beds": i.beds
                }

                result_list.append(result_dict)

            if not result_list:
                return jsonify(error="nothing found, search failed"), 404
            else:
                return jsonify(resp=result_list), 200
        else:
            return jsonify(message="nothing found", status="failed"), 404


@app.route('/property_post', methods=['POST'])
def property_post():
    def get_new_property_id():
        n = randint(10000, 99999)
        check_temp_id = PROPERTY_INFO.query.filter_by(propertyId=n).first()
        if check_temp_id:
            get_new_property_id()
        else:
            return n

    try:
        tk = str(request.headers['Authorization']).split(' ')[1]
        user = USER_INFO.query.filter_by(curr_token=tk).first()

        if user and user.login_status == '1' and time.time() < float(user.expire_time):
            try:
                jsonContent = request.get_json()
                try:
                    np = PROPERTY_INFO(propertyId=get_new_property_id(),
                                       sellerId=user.uid,
                                       propertyPostDate=str(int(time.time()))
                                       )
                    for k, v in jsonContent.items():
                        if k == 'propertyId' or k == 'sellerId' or k == 'propertyPostDate' \
                                or k == 'compare_addr' or k == 'auction_end':
                            continue
                        if k == 'propertyType':
                            np.propertyType = str(v)
                        elif k == 'unitNumber':
                            np.unitNumber = str(v)
                        elif k == 'streetAddress':
                            np.streetAddress = str(v)
                        elif k == 'city':
                            np.suburb = str(v)
                        elif k == 'state':
                            np.state = str(v)
                        elif k == 'postcode':
                            np.postcode = str(v)
                        elif k == 'beds':
                            np.beds = str(v)
                        elif k == 'baths':
                            np.baths = str(v)
                        elif k == 'parkingSpace':
                            np.parkingSpace = str(v)
                        elif k == 'landSize':
                            np.landSize = str(v)
                        elif k == 'reservePrice':
                            np.reservePrice = str(v)
                        elif k == 'auction_start':
                            if len(v) == 13:
                                np.auction_start = str(int(v[0:-3]))
                            else:
                                return jsonify(error="Date range length not looks quite right"), 400
                        elif k == 'auction_duration':
                            np.auction_end = str(int(np.auction_start) + int(v[0:-3]))
                        elif k == 'intro_title':
                            np.intro_title = str(v)
                        elif k == 'intro_text':
                            np.intro_text = str(v)
                        elif k == 'images':
                            # np.images = str(v)
                            print(np.propertyId, v[0])
                        else:
                            return jsonify(error="Unexpected attributes received, nothing changed"), 400

                    db.session.merge(np)
                    db.session.commit()

                    return jsonify(msg="Property post successful", propertyId=str(np.propertyId)), 200

                except ValueError:
                    return jsonify(error="auction_start format not valid"), 400
                except KeyError:
                    return jsonify(error="Expected attributes not received, post failed"), 400
            except ValueError:
                return jsonify(error="No JSON object could be decoded, nothing to be changed"), 400
        else:
            return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
    except IndexError:
        return jsonify(error="Token format not valid, nothing to be changed"), 401
    except KeyError:
        return jsonify(error="Token not received, nothing to be changed"), 401

# @app.route('/example', methods=['POST'])
# def example():
#     def get_new_example_id():
#         n = randint(10000, 99999)
#         check_temp_id = PROPERTY_INFO.query.filter_by(propertyId=n).first()
#         if check_temp_id:
#             get_new_example_id()
#         else:
#             return n
#
#     try:
#         tk = str(request.headers['Authorization']).split(' ')[1]
#         user = USER_INFO.query.filter_by(curr_token=tk).first()
#
#         if user and user.login_status == '1' and time.time() < float(user.expire_time[0:-3]):
#             uid = user.uid
#             try:
#                 jsonContent = request.get_json()
#                 try:
#                     # code goes here
#
#                     return jsonify(msg="post successful"), 200
#                 except KeyError:
#                     return jsonify(error="Expected attributes not received, post failed"), 400
#             except ValueError:
#                 return jsonify(error="No JSON object could be decoded, nothing to be changed"), 400
#         else:
#             return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
#     except IndexError:
#         return jsonify(error="Token format not valid, nothing to be changed"), 401
#     except KeyError:
#         return jsonify(error="Token not received, nothing to be changed"), 401
