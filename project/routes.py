import os
import secrets
import subprocess
import time
import uuid

import googlemaps
from random import randint
from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash
from . import db, create_app
from .models import USER_INFO, USER_INFO_EXTENDED, PROPERTY_INFO, PROPERTY_BID_RELATION, BID_ACTIVITY, MOVEMENT_TRACKING
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
                                            seller_flag=jsonContent['seller_flag']
                                            )
                db.session.add(nu)
                db.session.add(nu_ext)
                db.session.commit()

                user_type = ''
                if jsonContent['bidder_flag'] == "0" and jsonContent['seller_flag'] == "1":
                    user_type = 'seller'
                if jsonContent['bidder_flag'] == "1" and jsonContent['seller_flag'] == "0":
                    user_type = 'bidder'

                return jsonify(token=tk, expire_time=str(et + '000'), user_type=user_type), 200
        except KeyError:
            return jsonify(error="Expected attributes not received, signup failed"), 400
    except ValueError:
        return jsonify(error="No JSON object could be decoded, signup failed"), 400


@app.route('/profile', methods=['GET', 'PUT'])
def profile_update():
    if request.method == 'GET':
        try:
            tk = str(request.headers['Authorization']).split(' ')[1]
            user = USER_INFO.query.filter_by(curr_token=tk).first()

            if user and user.login_status == '1' and time.time() < float(user.expire_time):
                uid = user.uid
                user_ext = USER_INFO_EXTENDED.query.filter_by(uid=uid).first()
                result_dict = {
                    "firstname": user_ext.firstname,
                    "lastname": user_ext.lastname,
                    "email": user.email,
                    "phone": user_ext.phone,
                    "address": user_ext.address,
                    "city": user_ext.suburb,
                    "state": user_ext.state,
                    "postcode": user_ext.postcode,
                    "bidder_flag": user_ext.bidder_flag,
                    "seller_flag": user_ext.seller_flag
                }
                return jsonify(result_dict), 200
            else:
                return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
        except IndexError:
            return jsonify(error="Token format not valid, nothing changed"), 401
        except KeyError:
            return jsonify(error="Token not received, nothing changed"), 401

    if request.method == 'PUT':
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
                                a = USER_INFO.query.filter_by(email=v).first()
                                if not a:
                                    user.email = v
                                elif a.uid == uid:
                                    user.email = v
                                else:
                                    return jsonify(
                                        error="Email address already exists, nothing changed"), 409
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


@app.route('/recommendation', methods=['GET'])
def recommendation_get():
    def random_5_p():
        recent_temp = PROPERTY_INFO.query.filter(PROPERTY_INFO.auction_start > str(int(time.time()))).limit(5).all()
        result_list = []
        if recent_temp:
            for i in recent_temp:
                # print(i)
                if i.unitNumber:
                    address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
                else:
                    address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode

                images_list = []
                if i.images and i.images != '0':
                    file_name = str(i.propertyId) + '-0'
                    download_blob(file_name)
                    image_str = open(file_name, 'r').read()
                    images_list.append(str(image_str))
                    os.remove(file_name)

                j = PROPERTY_BID_RELATION.query.filter_by(propertyId=i.propertyId).first()
                payment_method_list = []
                if j.bank_transfer_flag == '1':
                    payment_method_list.append("Bank Transfer")
                if j.cheque_flag == '1':
                    payment_method_list.append("Cheque")
                if j.card_flag == '1':
                    payment_method_list.append("Credit/Debit Card")

                result_dict = {
                    "propertyId": i.propertyId,
                    "propertyType": i.propertyType,
                    "address": address,
                    "city": i.suburb,
                    "beds": i.beds,
                    "baths": i.baths,
                    "parkingSpace": i.parkingSpace,
                    "landSize": i.landSize,
                    "auction_start": str(i.auction_start) + '000',
                    "images": images_list,
                    "intro_title": i.intro_title,
                    "accepted_payment_method": payment_method_list
                }

                result_list.append(result_dict)
            return result_list

    last_search_timestamp = ''
    last_search_by_uid = ''
    last_search_by_cid = ''
    if 'Authorization' in request.headers:
        try:
            tk = str(request.headers['Authorization']).split(' ')[1]
            user = USER_INFO.query.filter_by(curr_token=tk).first()
            if user and user.login_status == '1' and time.time() < float(user.expire_time):
                search_uid = user.uid
                if search_uid != '':
                    uid_history = MOVEMENT_TRACKING.query.filter_by(uid=search_uid)
                    last_search_by_uid_point = uid_history.order_by(
                        desc(MOVEMENT_TRACKING.accessDate)).first()
                    if last_search_by_uid_point:
                        last_search_by_uid = last_search_by_uid_point.accessDate
            else:
                nothing = True
        except IndexError:
            nothing = True
        except KeyError:
            nothing = True

    if 'CID' in request.headers:
        try:
            current_CID = str(request.headers['CID'])
            search_cid = current_CID
            if search_cid != '':
                cid_history = MOVEMENT_TRACKING.query.filter_by(cid=search_cid)
                # print(cid_history)
                last_search_by_cid_point = cid_history.order_by(
                    desc(MOVEMENT_TRACKING.accessDate)).first()
                if last_search_by_cid_point:
                    last_search_by_cid = last_search_by_cid_point.accessDate
            else:
                nothing = True
        except IndexError:
            nothing = True
        except KeyError:
            nothing = True

    if last_search_by_uid != '' and last_search_by_cid != '':
        if last_search_by_uid > last_search_by_cid:
            last_search_timestamp = last_search_by_uid
        else:
            last_search_timestamp = last_search_by_cid

    if last_search_by_uid != '' and last_search_by_cid == '':
        last_search_timestamp = last_search_by_uid

    if last_search_by_uid == '' and last_search_by_cid != '':
        last_search_timestamp = last_search_by_cid

    if last_search_timestamp != '':
        # print(last_search_timestamp)
        last_search = MOVEMENT_TRACKING.query.filter_by(accessDate=last_search_timestamp).first()
        if last_search:
            # core recommendation
            if not last_search.beds and not last_search.baths and not last_search.carspots:
                print("000")
                recent_5_list = random_5_p()
                return jsonify(resp=recent_5_list), 200
            else:
                recent = PROPERTY_INFO.query.filter(PROPERTY_INFO.auction_start > str(int(time.time())))
                if last_search.beds:
                    r = recent.filter(PROPERTY_INFO.beds == str(last_search.beds))
                else:
                    r = recent

                if last_search.baths:
                    rr = r.filter(PROPERTY_INFO.baths == str(last_search.baths))
                else:
                    rr = r

                if last_search.carspots:
                    rrr = rr.filter(PROPERTY_INFO.parkingSpace == str(last_search.carspots)).all()
                else:
                    rrr = rr

                if not rrr:
                    # print("no rrr")
                    recent_5_list = random_5_p()
                    return jsonify(resp=recent_5_list), 200
                else:
                    # print(rrr)
                    ll = []
                    for i in rrr:
                        # print(i)
                        if i.unitNumber:
                            address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' \
                                      + i.state + ' ' + i.postcode
                        else:
                            address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode

                        images_list = []
                        if i.images and i.images != '0':
                            file_name = str(i.propertyId) + '-0'
                            download_blob(file_name)
                            image_str = open(file_name, 'r').read()
                            images_list.append(str(image_str))
                            os.remove(file_name)

                        j = PROPERTY_BID_RELATION.query.filter_by(propertyId=i.propertyId).first()
                        payment_method_list = []
                        if j.bank_transfer_flag == '1':
                            payment_method_list.append("Bank Transfer")
                        if j.cheque_flag == '1':
                            payment_method_list.append("Cheque")
                        if j.card_flag == '1':
                            payment_method_list.append("Credit/Debit Card")

                        result_dict = {
                            "propertyId": i.propertyId,
                            "propertyType": i.propertyType,
                            "address": address,
                            "city": i.suburb,
                            "beds": i.beds,
                            "baths": i.baths,
                            "parkingSpace": i.parkingSpace,
                            "landSize": i.landSize,
                            "auction_start": str(i.auction_start) + '000',
                            "images": images_list,
                            "intro_title": i.intro_title,
                            "accepted_payment_method": payment_method_list
                        }

                        ll.append(result_dict)

                    if ll:
                        return jsonify(resp=ll), 200
                    else:
                        recent_5_list = random_5_p()
                        return jsonify(resp=recent_5_list), 200


        else:
            print("no search history")
            recent_5_list = random_5_p()
            return jsonify(resp=recent_5_list), 200
    else:
        print("no search history")
        recent_5_list = random_5_p()
        return jsonify(resp=recent_5_list), 200


@app.route('/search', methods=['GET'])
def property_search():
    if 'keyword' not in request.args:
        return jsonify(message="expected conditions not received", status="search failed"), 400
    else:
        # Record search history
        def get_new_movement_id():
            n = randint(10000, 99999)
            check_temp_movement_id = MOVEMENT_TRACKING.query.filter_by(movementId=n).first()
            if check_temp_movement_id:
                get_new_movement_id()
            else:
                return n

        mov = MOVEMENT_TRACKING(movementId=get_new_movement_id())
        new_cookies_CID = str(uuid.uuid4())

        if 'Authorization' in request.headers:
            try:
                tk = str(request.headers['Authorization']).split(' ')[1]
                user = USER_INFO.query.filter_by(curr_token=tk).first()
                if user and user.login_status == '1' and time.time() < float(user.expire_time):
                    mov.uid = user.uid
                else:
                    nothing = True
            except IndexError:
                nothing = True
            except KeyError:
                nothing = True

        if 'CID' not in request.headers:
            current_CID = new_cookies_CID
            mov.cid = current_CID
        else:
            current_CID = str(request.headers['CID'])
            mov.cid = current_CID

        mov.accessDate = str(int(time.time()))
        mov.searchKeyword = request.args.get('keyword')
        if 'beds' in request.args and request.args.get('beds') != "" and \
                request.args.get('beds') != "null" and request.args.get('beds') != "Any":
            mov.beds = int(request.args.get('beds'))
        if 'baths' in request.args and request.args.get('baths') != "" and \
                request.args.get('baths') != "null" and request.args.get('baths') != "Any":
            mov.baths = int(request.args.get('baths'))
        if 'carspots' in request.args and request.args.get('carspots') != "" and \
                request.args.get('carspots') != "null" and request.args.get('carspots') != "Any":
            mov.carspots = int(request.args.get('carspots'))

        db.session.add(mov)
        db.session.commit()

        #  search function
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

        # print(len(query_res.all()))

        result_list = []
        if query_res:
            for i in query_res:
                if i.unitNumber:
                    address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
                else:
                    address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode

                images_list = []
                if i.images and i.images != '0':
                    file_name = str(i.propertyId) + '-0'
                    download_blob(file_name)
                    image_str = open(file_name, 'r').read()
                    images_list.append(str(image_str))
                    os.remove(file_name)

                j = PROPERTY_BID_RELATION.query.filter_by(propertyId=i.propertyId).first()
                payment_method_list = []
                if j.bank_transfer_flag == '1':
                    payment_method_list.append("Bank Transfer")
                if j.cheque_flag == '1':
                    payment_method_list.append("Cheque")
                if j.card_flag == '1':
                    payment_method_list.append("Credit/Debit Card")

                result_dict = {
                    "propertyId": i.propertyId,
                    "propertyType": i.propertyType,
                    "address": address,
                    "city": i.suburb,
                    "beds": i.beds,
                    "baths": i.baths,
                    "parkingSpace": i.parkingSpace,
                    "landSize": i.landSize,
                    "auction_start": str(i.auction_start) + '000',
                    "images": images_list,
                    "intro_title": i.intro_title,
                    "accepted_payment_method": payment_method_list
                }

                if 'Authorization' in request.headers:
                    try:
                        tk = str(request.headers['Authorization']).split(' ')[1]
                        user = USER_INFO.query.filter_by(curr_token=tk).first()
                        if user and user.login_status == '1' and time.time() < float(user.expire_time):
                            uid = user.uid
                            user_ext = USER_INFO_EXTENDED.query.filter_by(uid=uid).first()
                            if user_ext.bidder_flag == '1' and user_ext.seller_flag == '0':
                                a = PROPERTY_BID_RELATION.query.filter_by(propertyId=i.propertyId).first()
                                if a:
                                    bidActivityId = a.bidActivityId
                                else:
                                    return jsonify(error="No such auction"), 400
                                check = BID_ACTIVITY.query.filter_by(bidActivityId=bidActivityId, uid=uid).first()
                                if check:
                                    result_dict['bidderRegisterRequired'] = False
                                else:
                                    result_dict['bidderRegisterRequired'] = True
                            #
                            # else:
                            #     return jsonify(error="User type not correct, nothing to be changed"), 401
                        # else:
                        #     return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
                    except IndexError:
                        nothing = True

                result_list.append(result_dict)

            if not result_list:
                return jsonify(error="nothing found, search failed"), 404
            else:
                return jsonify(cid=current_CID,
                               resp=result_list), 200
        else:
            return jsonify(message="nothing found", status="failed"), 404


@app.route('/property', methods=['GET', 'POST'])
def property_get_n_post():
    if request.method == 'POST':
        def get_new_property_id():
            n = randint(10000, 99999)
            check_temp_id = PROPERTY_INFO.query.filter_by(propertyId=n).first()
            if check_temp_id:
                get_new_property_id()
            else:
                return n

        def get_new_bid_activity_id():
            n = randint(10000, 99999)
            check_temp_id = PROPERTY_BID_RELATION.query.filter_by(bidActivityId=n).first()
            if check_temp_id:
                get_new_bid_activity_id()
            else:
                return n

        try:
            tk = str(request.headers['Authorization']).split(' ')[1]
            user = USER_INFO.query.filter_by(curr_token=tk).first()

            if user and user.login_status == '1' and time.time() < float(user.expire_time):
                uid = user.uid
                user_ext = USER_INFO_EXTENDED.query.filter_by(uid=uid).first()
                if user_ext.bidder_flag == '0' and user_ext.seller_flag == '1':
                    try:
                        jsonContent = request.get_json()
                        try:
                            np = PROPERTY_INFO(propertyId=get_new_property_id(),
                                               sellerId=user.uid,
                                               propertyPostDate=str(int(time.time()))
                                               )

                            bank_transfer_flag = ''
                            bsb = ''
                            acc_number = ''
                            cheque_flag = ''
                            card_flag = ''

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
                                    np.auction_end = str(int(np.auction_start) + int(v))
                                elif k == 'intro_title':
                                    np.intro_title = str(v)
                                elif k == 'intro_text':
                                    np.intro_text = str(v)
                                elif k == 'images':
                                    if v:
                                        seq = 0
                                        for i in v:
                                            file_name = str(np.propertyId) + '-' + str(seq)
                                            with open(file_name, "w") as f:
                                                f.write(i)
                                                seq += 1
                                            upload_blob(file_name)
                                            os.remove(file_name)
                                        np.images = str(seq)
                                    else:
                                        np.images = '0'
                                elif k == 'bank_transfer_flag':
                                    if v and v == "1":
                                        bank_transfer_flag = "1"
                                elif k == 'bsb':
                                    if v and v != "":
                                        bsb = v
                                elif k == 'acc_number':
                                    if v and v != "":
                                        acc_number = v
                                elif k == 'cheque_flag':
                                    if v and v == "1":
                                        cheque_flag = "1"
                                # elif k == 'cheque_name':
                                #     if v and v != "":
                                #         cheque_name = v
                                elif k == 'card_flag':
                                    if v and v == "1":
                                        card_flag = "1"
                                else:
                                    return jsonify(error="Unexpected attributes received, nothing changed"), 400

                            db.session.merge(np)

                            pbr = PROPERTY_BID_RELATION(bidActivityId=get_new_bid_activity_id(),
                                                        propertyId=np.propertyId,
                                                        reserve_price=np.reservePrice,
                                                        start_time=np.auction_start,
                                                        expected_finish_time=np.auction_end,
                                                        bank_transfer_flag=bank_transfer_flag,
                                                        bsb=bsb,
                                                        acc_number=acc_number,
                                                        cheque_flag=cheque_flag,
                                                        # cheque_name=cheque_name,
                                                        card_flag=card_flag
                                                        )
                            db.session.merge(pbr)

                            db.session.commit()

                            return jsonify(msg="Property post successful", propertyId=str(np.propertyId)), 200

                        except ValueError:
                            return jsonify(error="auction_start format not valid"), 400
                        except KeyError:
                            return jsonify(error="Expected attributes not received, post failed"), 400
                    except ValueError:
                        return jsonify(error="No JSON object could be decoded, nothing to be changed"), 400
                else:
                    return jsonify(error="User type not correct, nothing to be changed"), 401
            else:
                return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
        except IndexError:
            return jsonify(error="Token format not valid, nothing to be changed"), 401
        except KeyError:
            return jsonify(error="Token not received, nothing to be changed"), 401

    if request.method == 'GET':
        if 'id' in request.args and request.args.get('id') != "":
            propertyId = request.args.get('id')
            i = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first()
            if i:
                if i.unitNumber:
                    address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
                else:
                    address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode

                images_list = []
                if i.images and i.images != '0':
                    for j in range(0, int(i.images)):
                        file_name = str(i.propertyId) + '-' + str(j)
                        download_blob(file_name)
                        image_str = open(file_name, 'r').read()
                        images_list.append(str(image_str))
                        os.remove(file_name)

                seller = USER_INFO_EXTENDED.query.filter_by(uid=i.sellerId).first()

                j = PROPERTY_BID_RELATION.query.filter_by(propertyId=propertyId).first()
                payment_method_list = []
                if j.bank_transfer_flag == '1':
                    payment_method_list.append("Bank Transfer")
                if j.cheque_flag == '1':
                    payment_method_list.append("Cheque")
                if j.card_flag == '1':
                    payment_method_list.append("Credit/Debit Card")

                result_dict = {
                    "propertyId": i.propertyId,
                    "sellerName": seller.firstname + ' ' + seller.lastname,
                    "sellerId": seller.uid,
                    "sellerContactNumber": seller.phone,
                    "propertyType": i.propertyType,
                    "address": address,
                    "beds": i.beds,
                    "baths": i.baths,
                    "parkingSpace": i.parkingSpace,
                    "landSize": i.landSize,
                    "images": images_list,
                    "propertyPostDate": i.propertyPostDate,
                    "auction_start": i.auction_start + '000',
                    "auction_end": i.auction_end + '000',
                    "intro_title": i.intro_title,
                    "intro_text": i.intro_text,
                    "accepted_payment_method": payment_method_list
                }

                a = PROPERTY_BID_RELATION.query.filter_by(propertyId=propertyId).first()
                search_largest = BID_ACTIVITY.query.filter_by(bidActivityId=a.bidActivityId).order_by(
                    desc(BID_ACTIVITY.offerPrice)).first()
                if search_largest:
                    result_dict['curr_start_price'] = search_largest.offerPrice
                else:
                    result_dict['curr_start_price'] = 0

                if 'Authorization' in request.headers:
                    try:
                        tk = str(request.headers['Authorization']).split(' ')[1]
                        user = USER_INFO.query.filter_by(curr_token=tk).first()
                        if user and user.login_status == '1' and time.time() < float(user.expire_time):
                            uid = user.uid
                            user_ext = USER_INFO_EXTENDED.query.filter_by(uid=uid).first()
                            if user_ext.bidder_flag == '1' and user_ext.seller_flag == '0':
                                a = PROPERTY_BID_RELATION.query.filter_by(propertyId=i.propertyId).first()
                                if a:
                                    bidActivityId = a.bidActivityId
                                else:
                                    return jsonify(error="No such auction"), 400
                                check = BID_ACTIVITY.query.filter_by(bidActivityId=bidActivityId, uid=uid).first()
                                if check:
                                    result_dict['bidderRegisterRequired'] = False
                                else:
                                    result_dict['bidderRegisterRequired'] = True
                            #
                            # else:
                            #     return jsonify(error="User type not correct, nothing to be changed"), 401
                        # else:
                        #     return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
                    except IndexError:
                        # return jsonify(error="Token format not valid, nothing to be changed"), 401
                        nothing = True

                return jsonify(result_dict), 200
            else:
                return jsonify(error="Not found"), 404
        elif 'sellerid' in request.args and request.args.get('sellerid') != "":
            sellerId = request.args.get('sellerid')
            seller = USER_INFO_EXTENDED.query.filter_by(uid=sellerId).first()
            if not seller:
                return jsonify(error="User not found"), 404
            query_res = PROPERTY_INFO.query.filter_by(sellerId=sellerId).all()
            pp_list = []
            if query_res:
                for i in query_res:
                    if i.unitNumber:
                        address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' \
                                  + i.postcode
                    else:
                        address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode

                    images_list = []
                    if i.images and i.images != '0':
                        file_name = str(i.propertyId) + '-0'
                        download_blob(file_name)
                        image_str = open(file_name, 'r').read()
                        images_list.append(str(image_str))
                        os.remove(file_name)

                    j = PROPERTY_BID_RELATION.query.filter_by(propertyId=i.propertyId).first()
                    payment_method_list = []
                    if j.bank_transfer_flag == '1':
                        payment_method_list.append("Bank Transfer")
                    if j.cheque_flag == '1':
                        payment_method_list.append("Cheque")
                    if j.card_flag == '1':
                        payment_method_list.append("Credit/Debit Card")

                    r_property_dict = {
                        "propertyId": i.propertyId,
                        "propertyType": i.propertyType,
                        "address": address,
                        "city": i.suburb,
                        "beds": i.beds,
                        "baths": i.baths,
                        "parkingSpace": i.parkingSpace,
                        "landSize": i.landSize,
                        "auction_start": str(i.auction_start) + '000',
                        "images": images_list,
                        "intro_title": i.intro_title,
                        "accepted_payment_method": payment_method_list
                    }
                    pp_list.append(r_property_dict)

            return_dict = {
                "sellerId": sellerId,
                "name": seller.firstname + ' ' + seller.lastname,
                "address": seller.address + ', ' + seller.suburb + ', ' + seller.state + ', ' + seller.postcode,
                "phone": seller.phone,
                "listing": pp_list
            }

            return jsonify(return_dict), 200

        else:
            return jsonify(error="Expected attribute 'id' or 'sellerid' not received, GET property detail failed"), 400


@app.route('/mylisting', methods=['GET'])
def see_my_listing():
    try:
        tk = str(request.headers['Authorization']).split(' ')[1]
        user = USER_INFO.query.filter_by(curr_token=tk).first()

        if user and user.login_status == '1' and time.time() < float(user.expire_time):
            uid = user.uid
            user_ext = USER_INFO_EXTENDED.query.filter_by(uid=uid).first()
            if user_ext.bidder_flag == '0' and user_ext.seller_flag == '1':
                query_res = PROPERTY_INFO.query.filter_by(sellerId=uid).all()
                # print(query_res)
                pp_list = []
                if query_res:
                    for i in query_res:
                        if i.unitNumber:
                            address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' \
                                      + i.postcode
                        else:
                            address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode

                        images_list = []
                        if i.images and i.images != '0':
                            file_name = str(i.propertyId) + '-0'
                            download_blob(file_name)
                            image_str = open(file_name, 'r').read()
                            images_list.append(str(image_str))
                            os.remove(file_name)

                        j = PROPERTY_BID_RELATION.query.filter_by(propertyId=i.propertyId).first()
                        payment_method_list = []
                        if j.bank_transfer_flag == '1':
                            payment_method_list.append("Bank Transfer")
                        if j.cheque_flag == '1':
                            payment_method_list.append("Cheque")
                        if j.card_flag == '1':
                            payment_method_list.append("Credit/Debit Card")

                        r_property_dict = {
                            "propertyId": i.propertyId,
                            "propertyType": i.propertyType,
                            "address": address,
                            "city": i.suburb,
                            "beds": i.beds,
                            "baths": i.baths,
                            "parkingSpace": i.parkingSpace,
                            "landSize": i.landSize,
                            "auction_start": str(i.auction_start) + '000',
                            "images": images_list,
                            "intro_title": i.intro_title,
                            "accepted_payment_method": payment_method_list
                        }
                        pp_list.append(r_property_dict)

                return_dict = {
                    "sellerId": uid,
                    "name": user_ext.firstname + ' ' + user_ext.lastname,
                    "address": user_ext.address + ', ' + user_ext.suburb + ', ' + user_ext.state + ', ' + user_ext.postcode,
                    "phone": user_ext.phone,
                    "listing": pp_list
                }

                return jsonify(return_dict), 200
            else:
                return jsonify(error="User type not correct, nothing to be changed"), 401
        else:
            return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
    except IndexError:
        return jsonify(error="Token format not valid, nothing to be changed"), 401
    except KeyError:
        return jsonify(error="Token not received, nothing to be changed"), 401


@app.route('/bid', methods=['GET', 'POST'])
def bid():
    if request.method == 'POST':
        try:
            tk = str(request.headers['Authorization']).split(' ')[1]
            user = USER_INFO.query.filter_by(curr_token=tk).first()

            if user and user.login_status == '1' and time.time() < float(user.expire_time):
                uid = user.uid
                user_ext = USER_INFO_EXTENDED.query.filter_by(uid=uid).first()
                if user_ext.bidder_flag == '1' and user_ext.seller_flag == '0':
                    try:
                        jsonContent = request.get_json()
                        try:
                            propertyId = jsonContent['id']
                            a = PROPERTY_BID_RELATION.query.filter_by(propertyId=propertyId).first()
                            if not a:
                                return jsonify(error="Not such auction exists"), 400

                            cur_time = int(time.time())
                            b = BID_ACTIVITY.query.filter_by(bidActivityId=a.bidActivityId, uid=uid).first()

                            if not b and cur_time < float(a.start_time):
                                offerPrice = jsonContent['offerPrice']
                                i_b = BID_ACTIVITY(uid=uid,
                                                   bidActivityId=a.bidActivityId,
                                                   offerPrice=offerPrice,
                                                   bidPlaceTime=str(cur_time),
                                                   initial_bid_flag="1",
                                                   payment_method_as_buyer=jsonContent['paymentMethod'],
                                                   cardholderName=jsonContent['cardHolderName'],
                                                   cardNumber=jsonContent['cardNumber'],
                                                   cardExp=jsonContent['cardExpiration'],
                                                   cardCVV=jsonContent['cardCV']
                                                   )
                                db.session.add(i_b)
                                db.session.commit()

                                search_largest = BID_ACTIVITY.query.filter_by(bidActivityId=a.bidActivityId).order_by(
                                    desc(BID_ACTIVITY.offerPrice)).first()
                                if search_largest:
                                    if int(offerPrice) < int(search_largest.offerPrice):
                                        curr_start_price = search_largest.offerPrice
                                    else:
                                        curr_start_price = offerPrice
                                else:
                                    curr_start_price = offerPrice

                                return jsonify(msg="Your price has been accepted, this is your initial bid",
                                               ref=i_b.lineId,
                                               bid_time=str(i_b.bidPlaceTime) + '000',
                                               expected_finish_time=a.expected_finish_time + '000',
                                               yourPrice=offerPrice,
                                               start_time=str(a.start_time),
                                               curr_start_price=curr_start_price), 200

                            elif b and cur_time < float(a.start_time):
                                return jsonify(
                                    error="You cannot change initial bid and the auction has not started yet",
                                    yourInitialBid=int(b.offerPrice)), 409

                            elif not b and float(a.start_time) <= cur_time <= float(
                                    a.expected_finish_time):
                                return jsonify(
                                    error="You cannot participate this auction because you did not register as RAB "
                                          "before auction starts"), 409

                            elif b and float(a.start_time) <= cur_time <= float(
                                    a.expected_finish_time):

                                offerPrice = jsonContent['offerPrice']
                                search_largest = BID_ACTIVITY.query.filter_by(bidActivityId=a.bidActivityId).order_by(
                                    desc(BID_ACTIVITY.offerPrice)).first()
                                if search_largest:
                                    if int(offerPrice) <= int(search_largest.offerPrice):
                                        return jsonify(msg="We did not accept your offer",
                                                       bid_time=str(cur_time) + '000',
                                                       expected_finish_time=a.expected_finish_time + '000',
                                                       yourPrice=offerPrice,
                                                       curr_higest_price=search_largest.offerPrice,
                                                       start_time=str(a.start_time)), 409

                                check = int(a.expected_finish_time) - int(cur_time)
                                if check <= 5 * 60:
                                    a.expected_finish_time = str(int(a.expected_finish_time) + 2 * 60)
                                    # a.expected_finish_time = str(int(a.expected_finish_time) + 1)
                                    db.session.merge(a)
                                    c = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first()
                                    c.auction_end = a.expected_finish_time
                                    db.session.merge(c)

                                nb = BID_ACTIVITY(uid=uid,
                                                  bidActivityId=a.bidActivityId,
                                                  offerPrice=offerPrice,
                                                  bidPlaceTime=str(cur_time)
                                                  )
                                db.session.add(nb)
                                db.session.commit()

                                return jsonify(msg="Your price has been accepted",
                                               ref=nb.lineId,
                                               bid_time=str(nb.bidPlaceTime) + '000',
                                               expected_finish_time=a.expected_finish_time + '000',
                                               yourPrice=offerPrice,
                                               start_time=str(a.start_time)), 200

                            elif cur_time > float(a.expected_finish_time):
                                if not a.winnerId:
                                    search_largest = BID_ACTIVITY.query.filter_by(
                                        bidActivityId=a.bidActivityId).order_by(
                                        desc(BID_ACTIVITY.offerPrice)).first()
                                    if search_largest:
                                        if int(search_largest.offerPrice) > int(a.reserve_price):
                                            a.winnerId = search_largest.uid
                                            a.final_price = search_largest.offerPrice
                                            db.session.merge(a)
                                            db.session.commit()
                                            u = USER_INFO_EXTENDED.query.filter_by(uid=search_largest.uid).first()

                                            return jsonify(msg="The auction has finished. We have a winner",
                                                           winner=u.firstname + ' ' + u.lastname,
                                                           final_price=a.final_price,
                                                           start_time=a.start_time + '000',
                                                           end_time=a.expected_finish_time + '000',
                                                           cur_time=str(cur_time) + '000'), 409
                                        else:
                                            return jsonify(
                                                error="The auction has ended. No one offered more than reserve price",
                                                winner="",
                                                final_price="",
                                                start_time=a.start_time + '000',
                                                end_time=a.expected_finish_time + '000',
                                                cur_time=str(cur_time) + '000'), 409
                                    else:
                                        return jsonify(
                                            error="The auction has ended. No one offered more than reserve price",
                                            winner="",
                                            final_price="",
                                            start_time=a.start_time + '000',
                                            end_time=a.expected_finish_time + '000',
                                            cur_time=str(cur_time) + '000'), 409
                                else:
                                    u = USER_INFO_EXTENDED.query.filter_by(uid=a.winnerId).first()
                                    return jsonify(msg="The auction has finished. We have a winner",
                                                   winner=u.firstname + ' ' + u.lastname,
                                                   final_price=a.final_price,
                                                   start_time=a.start_time + '000',
                                                   end_time=a.expected_finish_time + '000',
                                                   cur_time=str(cur_time) + '000'), 409
                            else:
                                return jsonify(
                                    error="You bid request somehow did not accepted by system"), 400
                        except KeyError:
                            return jsonify(error="Expected attributes not received, post failed"), 400
                    except ValueError:
                        return jsonify(error="No JSON object could be decoded, nothing to be changed"), 400
                else:
                    return jsonify(error="User type not correct, nothing to be changed"), 401
            else:
                return jsonify(error="Token not valid, nothing to be changed, try login first"), 401
        except IndexError:
            return jsonify(error="Token format not valid, nothing to be changed"), 401
        except KeyError:
            return jsonify(error="Token not received, nothing to be changed"), 401

    if request.method == 'GET':
        if 'id' not in request.args:
            return jsonify(message="expected condition 'id' not received"), 400
        propertyId = request.args['id']
        cur_time = int(time.time())
        a = PROPERTY_BID_RELATION.query.filter_by(propertyId=propertyId).first()
        if not a:
            return jsonify(error="No such auction exists"), 400
        b = BID_ACTIVITY.query.filter_by(bidActivityId=a.bidActivityId)
        bid_history_list = []
        for k in b:
            bidder = USER_INFO_EXTENDED.query.filter_by(uid=k.uid).first()
            bidder_name = bidder.firstname + ' ' + bidder.lastname
            r_dict = {'bidder_name': bidder_name,
                      'offerPrice': k.offerPrice,
                      'bidPlaceTime': k.bidPlaceTime
                      }
            bid_history_list.append(r_dict)

        search_largest = BID_ACTIVITY.query.filter_by(
            bidActivityId=a.bidActivityId).order_by(
            desc(BID_ACTIVITY.offerPrice)).first()

        if cur_time < float(a.start_time):
            return jsonify(error='The auction has not started yet.',
                           propertyId=propertyId,
                           start_time=a.start_time + '000',
                           end_time=a.expected_finish_time + '000',
                           cur_time=str(int(time.time())) + '000'
                           ), 409

        elif float(a.start_time) < cur_time < float(a.expected_finish_time):
            curr_highest_price = ''
            if search_largest:
                curr_highest_price = search_largest.offerPrice
            return jsonify(msg="The auction is undergoing.",
                           history=bid_history_list,
                           length=str(len(bid_history_list)),
                           propertyId=propertyId,
                           start_time=a.start_time + '000',
                           end_time=a.expected_finish_time + '000',
                           cur_time=str(int(time.time())) + '000',
                           curr_highest_price=curr_highest_price
                           ), 200

        elif cur_time > float(a.expected_finish_time):
            if not a.winnerId:
                if search_largest:
                    if int(search_largest.offerPrice) > int(a.reserve_price):
                        a.winnerId = search_largest.uid
                        a.final_price = search_largest.offerPrice
                        db.session.merge(a)
                        db.session.commit()
                        u = USER_INFO_EXTENDED.query.filter_by(uid=search_largest.uid).first()

                        # bid result notifications
                        if a.email_flag != "1":
                            a.email_flag = "1"
                            db.session.merge(a)
                            db.session.commit()
                            # print("aaa")
                            sellerId = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first().sellerId
                            seller_info_ext = USER_INFO_EXTENDED.query.filter_by(uid=sellerId).first()
                            seller_email = USER_INFO.query.filter_by(uid=sellerId).first().email
                            i = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first()
                            if i.unitNumber:
                                property_address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + \
                                                   i.state + ' ' + i.postcode
                            else:
                                property_address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
                            pm = BID_ACTIVITY.query.filter_by(uid=a.winnerId, bidActivityId=a.bidActivityId,
                                                              initial_bid_flag="1").first().payment_method_as_buyer
                            buyer_email = USER_INFO.query.filter_by(uid=a.winnerId).first().email
                            p = subprocess.Popen(["python3",
                                                  "project/email_notification.py",
                                                  "successToSeller",
                                                  seller_info_ext.firstname + ' ' + seller_info_ext.lastname,
                                                  seller_email,
                                                  property_address,
                                                  str(a.final_price),
                                                  u.firstname + ' ' + u.lastname,
                                                  pm,
                                                  buyer_email,
                                                  u.phone,
                                                  u.address + ', ' + u.suburb + ' ' + u.state + ' ' + u.postcode
                                                  ])
                            q = subprocess.Popen(["python3",
                                                  "project/email_notification.py",
                                                  "successToBuyer",
                                                  u.firstname + ' ' + u.lastname,
                                                  buyer_email,
                                                  property_address,
                                                  str(a.final_price),
                                                  pm,
                                                  seller_info_ext.firstname + ' ' + seller_info_ext.lastname,
                                                  seller_email,
                                                  seller_info_ext.phone,
                                                  ])

                        return jsonify(msg="The auction has finished. We have a winner",
                                       winner=u.firstname + ' ' + u.lastname,
                                       final_price=a.final_price,
                                       start_time=a.start_time + '000',
                                       end_time=a.expected_finish_time + '000',
                                       cur_time=str(cur_time) + '000',
                                       history=bid_history_list,
                                       length=str(len(bid_history_list)),
                                       propertyId=propertyId
                                       ), 200
                    else:
                        if a.email_flag != "1":
                            a.email_flag = "1"
                            db.session.merge(a)
                            db.session.commit()
                            sellerId = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first().sellerId
                            seller_info_ext = USER_INFO_EXTENDED.query.filter_by(uid=sellerId).first()
                            seller_email = USER_INFO.query.filter_by(uid=sellerId).first().email
                            i = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first()
                            if i.unitNumber:
                                property_address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + \
                                                   i.state + ' ' + i.postcode
                            else:
                                property_address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
                            p = subprocess.Popen(["python3",
                                                  "project/email_notification.py",
                                                  "failToSeller",
                                                  seller_info_ext.firstname + ' ' + seller_info_ext.lastname,
                                                  seller_email,
                                                  property_address
                                                  ])
                        return jsonify(
                            error="The auction has ended. No one offered more than reserve price",
                            winner="",
                            final_price="",
                            start_time=a.start_time + '000',
                            end_time=a.expected_finish_time + '000',
                            cur_time=str(cur_time) + '000',
                            history=bid_history_list,
                            length=str(len(bid_history_list)),
                            propertyId=propertyId
                        ), 200

                if a.email_flag != "1":
                    a.email_flag = "1"
                    db.session.merge(a)
                    db.session.commit()
                    sellerId = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first().sellerId
                    seller_info_ext = USER_INFO_EXTENDED.query.filter_by(uid=sellerId).first()
                    seller_email = USER_INFO.query.filter_by(uid=sellerId).first().email
                    i = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first()
                    if i.unitNumber:
                        property_address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + \
                                           i.state + ' ' + i.postcode
                    else:
                        property_address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
                    p = subprocess.Popen(["python3",
                                          "project/email_notification.py",
                                          "failToSeller",
                                          seller_info_ext.firstname + ' ' + seller_info_ext.lastname,
                                          seller_email,
                                          property_address
                                          ])
                return jsonify(
                    error="The auction has ended. No one offered more than reserve price",
                    winner="",
                    final_price="",
                    start_time=a.start_time + '000',
                    end_time=a.expected_finish_time + '000',
                    cur_time=str(cur_time) + '000',
                    history=bid_history_list,
                    length=str(len(bid_history_list)),
                    propertyId=propertyId
                ), 200
            else:
                u = USER_INFO_EXTENDED.query.filter_by(uid=a.winnerId).first()
                # bid result notifications
                if a.email_flag != "1":
                    a.email_flag = "1"
                    db.session.merge(a)
                    db.session.commit()

                    sellerId = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first().sellerId
                    seller_info_ext = USER_INFO_EXTENDED.query.filter_by(uid=sellerId).first()
                    seller_email = USER_INFO.query.filter_by(uid=sellerId).first().email
                    i = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first()
                    if i.unitNumber:
                        property_address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + \
                                           i.state + ' ' + i.postcode
                    else:
                        property_address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
                    pm = BID_ACTIVITY.query.filter_by(uid=a.winnerId, bidActivityId=a.bidActivityId,
                                                      initial_bid_flag="1").first().payment_method_as_buyer
                    buyer_email = USER_INFO.query.filter_by(uid=a.winnerId).first().email
                    p = subprocess.Popen(["python3",
                                          "project/email_notification.py",
                                          "successToSeller",
                                          seller_info_ext.firstname + ' ' + seller_info_ext.lastname,
                                          seller_email,
                                          property_address,
                                          str(a.final_price),
                                          u.firstname + ' ' + u.lastname,
                                          pm,
                                          buyer_email,
                                          u.phone,
                                          u.address + ', ' + u.suburb + ' ' + u.state + ' ' + u.postcode
                                          ])
                    q = subprocess.Popen(["python3",
                                          "project/email_notification.py",
                                          "successToBuyer",
                                          u.firstname + ' ' + u.lastname,
                                          buyer_email,
                                          property_address,
                                          str(a.final_price),
                                          pm,
                                          seller_info_ext.firstname + ' ' + seller_info_ext.lastname,
                                          seller_email,
                                          seller_info_ext.phone,
                                          ])

                return jsonify(msg="The auction has finished. We have a winner",
                               winner=u.firstname + ' ' + u.lastname,
                               final_price=a.final_price,
                               start_time=a.start_time + '000',
                               end_time=a.expected_finish_time + '000',
                               cur_time=str(cur_time) + '000',
                               history=bid_history_list,
                               length=str(len(bid_history_list)),
                               propertyId=propertyId
                               ), 200


@app.route('/get_rab_status', methods=['GET'])
def rab_status():
    try:
        tk = str(request.headers['Authorization']).split(' ')[1]
        user = USER_INFO.query.filter_by(curr_token=tk).first()

        if user and user.login_status == '1' and time.time() < float(user.expire_time):
            uid = user.uid
            user_ext = USER_INFO_EXTENDED.query.filter_by(uid=uid).first()
            if user_ext.bidder_flag == '1' and user_ext.seller_flag == '0':
                b = BID_ACTIVITY.query.filter_by(uid=uid).all()
                result_rab = []
                if b:
                    for i in b:
                        c = PROPERTY_BID_RELATION.query.filter_by(bidActivityId=i.bidActivityId).first()
                        if c.propertyId not in result_rab:
                            result_rab.append(c.propertyId)

                return jsonify(uid=uid,
                               rab_registered=result_rab), 200

            else:
                return jsonify(error="User type not correct, nothing to be changed"), 401
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


@app.route('/mapinfo', methods=['GET'])
def nearby_returns():
    # Set google map api keys:
    gmaps = googlemaps.Client(key='YOUR_OWN_GOOGLE_MAPS_API_KEY')
    #

    # Get Property id
    propertyId = request.args.get('id')

    # find address from database
    i = PROPERTY_INFO.query.filter_by(propertyId=propertyId).first()
    # print(query_res)
    address = ''
    if i:
        if i.unitNumber:
            address = i.unitNumber + '/' + i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode
        else:
            address = i.streetAddress + ', ' + i.suburb + ' ' + i.state + ' ' + i.postcode

    else:
        return jsonify(error="nothing found, search failed"), 404

    # print('address:', address)
    # google the address
    # now = time.time()
    geocode_result = gmaps.geocode(address)
    # print(time.time()-now, "s 1")

    location_origin = {'lat': geocode_result[0]['geometry']['location']['lat'],
                       'lng': geocode_result[0]['geometry']['location']['lng']}

    nearby_supermarket = gmaps.places_nearby(location=location_origin, radius=500, type='supermarket')['results']
    nearby_school = gmaps.places_nearby(location=location_origin, radius=2000, type='primary_school')['results']
    nearby_uni = gmaps.places_nearby(location=location_origin, radius=1000, type='university')['results']
    nearby_police = gmaps.places_nearby(location=location_origin, radius=3000, type='police')['results']
    nearby_hospitals = gmaps.places_nearby(location=location_origin, radius=1000, type='hospital')['results']

    all_nearby = [nearby_supermarket, nearby_school, nearby_uni, nearby_police, nearby_hospitals]
    all_nearby_filter = []
    for i in all_nearby:
        if len(i) > 0:
            all_nearby_filter.append(i[0])
        else:
            all_nearby_filter.append(i)
    nearby_supermarket = all_nearby_filter[0]
    nearby_school = all_nearby_filter[1]
    nearby_uni = all_nearby_filter[2]
    nearby_police = all_nearby_filter[3]
    nearby_hospitals = all_nearby_filter[4]

    # calculate the travel time
    supermarket_res = []
    school_res = []
    police_res = []
    hospitals_res = []
    university_res = []
    # print(all_nearby[0])
    all_res = [supermarket_res, school_res, university_res, police_res, hospitals_res]
    counter = 0
    for i in all_nearby_filter:
        if len(i) > 0:
            location_destination = i['geometry']['location']
            distance_by_walking = gmaps.distance_matrix(
                origins=location_origin,
                destinations=location_destination,
                mode='walking'
            )
            distance_by_driving = gmaps.distance_matrix(
                origins=location_origin,
                destinations=location_destination,
                mode='driving'
            )
            all_res[counter].append({'name': i['name'],
                                     'addr': distance_by_walking['destination_addresses'][0],
                                     'location': location_destination,
                                     'distance': distance_by_walking['rows'][0]['elements'][0]['distance']['text'],
                                     'travel_time_by_walking':
                                         distance_by_walking['rows'][0]['elements'][0]['duration'][
                                             'text'],
                                     'travel_time_by_driving':
                                         distance_by_driving['rows'][0]['elements'][0]['duration'][
                                             'text']
                                     })
        counter += 1

    all_res_filter = []
    for i in all_res:
        if len(i) == 0:
            all_res_filter.append({})
        else:
            all_res_filter.append(i[0])

    final_res = {'property_location': location_origin,
                 'supermarket': all_res_filter[0],
                 'school': all_res_filter[1],
                 'university': all_res_filter[2],
                 'police': all_res_filter[3],
                 'hospital': all_res_filter[4]}

    return jsonify(final_res), 200
