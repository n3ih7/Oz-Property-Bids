import json
from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from .models import USER_INFO, USER_INFO_EXTENDED
from . import db, create_app

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
                active_user.bsb = req['bsb']
                active_user.accNumber = req['accNumber']
                active_user.initialBid = req['initialBid']
                db.session.merge(active_user)
                db.session.commit()

                return jsonify(message="Your profile has been updated", status="update successful"), 200

            except KeyError:
                return jsonify(message="expected attributes not received", status="profile update failed"), 400

    try:
        active_user = USER_INFO_EXTENDED.query.get(current_user.email)
        active_user.firstname = req['firstname']
        active_user.lastname = req['lastname']
        active_user.birthYear = req['birthYear']
        active_user.gender = req['gender']
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
