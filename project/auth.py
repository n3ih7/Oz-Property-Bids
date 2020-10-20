import base64
import datetime
import json
import time
import uuid
from random import randint

from flask import request, jsonify, make_response
from flask_login import login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

from . import db, create_app
from .models import USER_INFO, USER_INFO_EXTENDED, MOVEMENT_TRACKING, PROPERTY_INFO

app = create_app()
SQLAlchemy(app)


@app.route('/login', methods=['POST'])
def login_post():
    logout_user()

    req = request.get_json()
    try:
        email = req['email']
        password = req['password']

        user = USER_INFO.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify(
                message='Please check your login details and try again', status="login failed"), 401

        login_user(user, remember=True)

        return jsonify(
            message="You are successfully logged in", status="login successful"), 200

    except KeyError:
        return jsonify(message="Expected attributes not received", status="login failed"), 400


@app.route('/signup', methods=['POST'])
def signup_post():
    req = request.get_json()
    try:
        email = req['email']
        password = req['password']

        user = USER_INFO.query.filter_by(email=email).first()

        if user:
            return jsonify(
                message="Email address already exists", status="signup failed"), 409

        new_user = USER_INFO(email=email, password=generate_password_hash(password, method='sha256'))
        new_user_info_extended = USER_INFO_EXTENDED(email=email, bidderTag=0)

        db.session.add(new_user)
        db.session.add(new_user_info_extended)
        db.session.commit()

        login_user(new_user, remember=True)

        return jsonify(message="You are successfully signed up", status="signup successful"), 200

    except KeyError:
        return jsonify(message="Expected attributes not received", status="signup failed"), 400


@app.route('/profile', methods=['POST'])
@login_required
def profile_update_post():
    req = request.get_json()
    req_json_check = json.loads(str(req).replace("\'", "\""))

    if "bidderTag" in req_json_check:
        if req['bidderTag'] == 1:
            try:
                active_user = USER_INFO_EXTENDED.query.get(current_user.email)
                active_user.bsb = int(req['bsb'])
                active_user.accNumber = int(req['accNumber'])
                active_user.initialBid = int(req['initialBid'])
                db.session.merge(active_user)
                db.session.commit()

                return jsonify(message="Your profile has been updated", status="update successful"), 200

            except KeyError:
                return jsonify(message="expected attributes not received", status="profile update failed"), 400

    try:
        active_user = USER_INFO_EXTENDED.query.get(current_user.email)
        active_user.firstname = req['firstname']
        active_user.lastname = req['lastname']
        active_user.birthYear = int(req['birthYear'])
        active_user.gender = int(req['gender'])
        active_user.phone = req['phone']
        db.session.merge(active_user)
        db.session.commit()

        return jsonify(message="Your profile has been updated", status="update successful"), 200

    except KeyError:
        return jsonify(message="expected attributes not received", status="profile update failed"), 400


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify(message="You are successfully logged out", status="successful"), 200





@app.route('/search_test', methods=['GET','POST'])
def search():


    req_filter = request.get_json()

    print(type(req_filter))
    print("initial_filter:", req_filter)
    print()
    #
    #
    req_filter_dict = {
                    "beds": str(req_filter.get('beds')),
                    "baths": str(req_filter.get('baths')),
                    "parkingSpace": str(req_filter.get('carspots')),
                    # "auction_start": req_filter.get['auction_start'],
                    # "compare_addr": req_filter.get['address'],
                    "propertyType": req_filter.get('propertyType')
                    }



    for i in list(req_filter_dict):
        if req_filter_dict[i] == 'Any':
            del req_filter_dict[i]

    if 'propertyType' in req_filter_dict.keys():
        propertytype_recorder = req_filter_dict.pop('propertyType')
    else:
        propertytype_recorder = 0

    more_than_three = []

    for i in list(req_filter_dict):
        if len(req_filter_dict[i]) > 1:
            more_than_three.append(i)
            del req_filter_dict[i]

    if propertytype_recorder:
        req_filter_dict['propertyType'] = propertytype_recorder

    print("more than three features:", more_than_three)
    print("filtered dict:", req_filter_dict)
    print()

    if req_filter.get('compare_addr'):
        compare_addr = '%' + req_filter.get('compare_addr') + '%'
    else:
        compare_addr = '%'

    auction_start = req_filter.get('auction_start')
    print("auction start:", auction_start)
    # auction_start = datetime.datetime.strptime(auction_start, "%Y-%m-%d")
    # print(auction_start)
    print(type(auction_start))
    print('compare_addr:', compare_addr)
    print()
    #filtering
    query_res = db.session.query(PROPERTY_INFO).filter_by(**req_filter_dict)\
                .filter(PROPERTY_INFO.compare_addr.like(compare_addr))\
                .filter(PROPERTY_INFO.auction_start >= auction_start)

    if 'beds' in more_than_three:
        query_res = query_res.filter(PROPERTY_INFO.beds > 3)
    if 'baths' in more_than_three:
        query_res = query_res.filter(PROPERTY_INFO.baths > 3)
    if 'parkingSpace' in more_than_three:
        query_res = query_res.filter(PROPERTY_INFO.parkingSpace > 3)


    result_list = []
    if query_res:
        for i in query_res:
            encoded = base64.b64encode(i.image)
            image_converted = encoded.decode('utf-8')
            result_dict = {
                "id" : i.propertyId,
                "propertyType": i.propertyType,
                "unitNumber": i.unitNumber,
                "streetAddress": i.streetAddress,
                "suburb": i.suburb,
                "state": i.state,
                "postcode": i.postcode,
                "beds": i.beds,
                "baths": i.baths,
                "parkingSpace": i.parkingSpace,
                "landSize": i.landSize,
                "sellerEmail": i.sellerEmail,
                "introTitle": i.introTitle,
                "introDetails": i.introDetails,
                "startPrice": i.startPrice,
                # "image": i.image,
                "image": image_converted,

                "auction_start": i.auction_start,
                "auction_end": i.auction_end,
                "compare_addr": i.compare_addr

            }
            result_list.append(result_dict)
            print("result_dict:", result_dict)
        print("result:",len(result_list))
        print()

        if not result_list:
            return jsonify(message="nothing found", status="failed"), 404

        resp = make_response(jsonify(result_list), 200)
        return resp
    else:
        return jsonify(message="nothing found", status="failed"), 404











@app.route('/buy', methods=['GET','POST'])
def property_search():
    if 'keyword' not in request.args:
        return jsonify(message="expected conditions not received", status="search failed"), 400
    else:
        # Record search history
        mov = MOVEMENT_TRACKING(movementId=randint(100000000, 999999999))
        new_cookies_CID = str(uuid.uuid4())
        if current_user.is_authenticated:
            mov.email = current_user.email
        if 'CID' not in request.cookies:
            mov.cid = new_cookies_CID
        else:
            mov.cid = request.cookies['CID']
        mov.accessDate = time.strftime("%H:%M:%S %d-%b-%Y", time.localtime())
        mov.searchKeyword = request.args.get('keyword')
        if 'type' in request.args:
            mov.propertyType = request.args.get('type')
        if 'bedrooms' in request.args:
            mov.beds = int(request.args.get('bedroom'))
        if 'bathrooms' in request.args:
            mov.baths = int(request.args.get('bathroom'))
        if 'minprice' in request.args:
            mov.minPrice = int(request.args.get('minprice'))
        if 'maxprice' in request.args:
            mov.maxPrice = int(request.args.get('maxprice'))
        if 'minlandsize' in request.args:
            mov.minLandSize = int(request.args.get('minlandsize'))

        db.session.add(mov)
        db.session.commit()

        req_filter = request.get_json()

        print(type(req_filter))
        print("initial_filter:", req_filter)
        #
        #
        req_filter_dict = {
            "beds": str(req_filter.get('beds')),
            "baths": str(req_filter.get('baths')),
            "parkingSpace": str(req_filter.get('carspots')),
            # "auction_start": req_filter.get['auction_start'],
            # "compare_addr": req_filter.get['address'],
            "propertyType": req_filter.get('propertyType')
        }

        for i in list(req_filter_dict):
            if req_filter_dict[i] == 'Any':
                del req_filter_dict[i]

        propertytype_recorder = req_filter_dict.pop('propertyType')

        more_than_three = []

        for i in list(req_filter_dict):
            if len(req_filter_dict[i]) > 1:
                more_than_three.append(i)
                del req_filter_dict[i]

        req_filter_dict['propertyType'] = propertytype_recorder

        print("more than three features:", more_than_three)

        if req_filter.get('compare_addr'):
            compare_addr = '%' + req_filter.get('compare_addr') + '%'
        else:
            compare_addr = '%'
        auction_start = req_filter.get('auction_start')
        print(auction_start)
        auction_start = datetime.datetime.strptime(auction_start, "%Y-%m-%d")
        print(auction_start)
        print(type(auction_start))

        print(req_filter_dict)
        print('compare_addr:', compare_addr)
        # filtering
        query_res = db.session.query(PROPERTY_INFO).filter_by(**req_filter_dict) \
            .filter(PROPERTY_INFO.compare_addr.like(compare_addr)) \
            .filter(PROPERTY_INFO.auction_start >= auction_start)

        if 'beds' in more_than_three:
            query_res = query_res.filter(PROPERTY_INFO.beds > 3)
        if 'baths' in more_than_three:
            query_res = query_res.filter(PROPERTY_INFO.baths > 3)
        if 'parkingSpace' in more_than_three:
            query_res = query_res.filter(PROPERTY_INFO.parkingSpace > 3)

        result_list = []
        if query_res:
            for i in query_res:
                # encoded = base64.b64encode(i.image)
                # image_converted = encoded.decode('ascii')
                result_dict = {

                    "propertyType": i.propertyType,
                    "unitNumber": i.unitNumber,
                    "streetAddress": i.streetAddress,
                    "suburb": i.suburb,
                    "state": i.state,
                    "postcode": i.postcode,
                    "beds": i.beds,
                    "baths": i.baths,
                    "parkingSpace": i.parkingSpace,
                    "landSize": i.landSize,
                    "sellerEmail": i.sellerEmail,
                    "introTitle": i.introTitle,
                    "introDetails": i.introDetails,
                    "startPrice": i.startPrice,
                    "image": i.image,
                    # "image": image_converted,

                    "auction_start": i.auction_start,
                    "auction_end": i.auction_end,
                    "compare_addr": i.compare_addr
                }
                result_list.append(result_dict)
            print(len(result_list))
            resp = make_response(jsonify(result_list), 200)
            return resp
        else:
            return jsonify(message="nothing found", status="failed"), 404



@app.route('/sell', methods=['POST'])
# @login_required
def property_post():
    req = request.get_json()
    req_json_check = json.loads(str(req).replace("\'", "\""))
    new_pp = PROPERTY_INFO(propertyId=randint(100000000, 999999999))
    new_pp.sellerEmail = current_user.email

    # f = open("project/sampleimg.png", "rb")
    # data = f.read()
    # img_stream = base64.b64encode(data)
    # f.close()
    #
    # new_pp.image = str(img_stream)

    if "unitNumber" in req_json_check:
        new_pp.unitNumber = req['unitNumber']
    # if "image" in req_json_check:
    #     new_pp.image = req['image']
    try:
        new_pp.propertyType = req['propertyType']
        new_pp.streetAddress = req['streetAddress']
        new_pp.suburb = req['suburb']
        new_pp.state = req['state']
        new_pp.postcode = int(req['postcode'])
        new_pp.beds = int(req['beds'])
        new_pp.baths = int(req['baths'])
        new_pp.parkingSpace = int(req['parkingSpace'])
        new_pp.landSize = int(req['landSize'])
        new_pp.introTitle = req['introTitle']
        new_pp.introDetails = req['introDetails']
        new_pp.startPrice = int(req['startprice'])
        new_pp.accessDate = time.strftime("%H:%M:%S %d-%b-%Y", time.localtime())

        db.session.add(new_pp)
        db.session.commit()
        return jsonify(message="Your property has been posted", status="post successful"), 200

    except KeyError:
        return jsonify(message="expected attributes not received", status="post failed"), 400

