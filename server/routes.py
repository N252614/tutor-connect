from flask import Blueprint, request, jsonify
from models import db, TutorProfile, User, Booking
from flask_jwt_extended import jwt_required, get_jwt_identity

# create blueprint for main routes
routes_bp = Blueprint("routes", __name__, url_prefix="/api")


# create tutor profile (ONLY for tutors)
@routes_bp.route("/tutor-profile", methods=["POST"])
@jwt_required()
def create_tutor_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    user = User.query.get(int(user_id))

    # check if user exists and is tutor
    if not user or user.role != "tutor":
        return jsonify({"error": "Only tutors can create profile"}), 403

    profile = TutorProfile(
        subject=data.get("subject"),
        location=data.get("location"),
        hourly_rate=data.get("hourly_rate"),
        bio=data.get("bio"),
        user_id=user.id
    )

    db.session.add(profile)
    db.session.commit()

    return jsonify({"message": "Tutor profile created"}), 201


# get all tutor profiles
@routes_bp.route("/tutors", methods=["GET"])
def get_tutors():
    profiles = TutorProfile.query.all()

    result = []

    for profile in profiles:
        result.append({
            "id": profile.id,
            "subject": profile.subject,
            "location": profile.location,
            "hourly_rate": profile.hourly_rate,
            "bio": profile.bio,
            "tutor": {
                "id": profile.user.id,
                "username": profile.user.username
            }
        })

    return jsonify(result), 200


# delete tutor profile (only owner can delete)
@routes_bp.route("/tutor-profile/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tutor_profile(id):
    user_id = get_jwt_identity()

    profile = TutorProfile.query.get(id)

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    # check ownership
    if profile.user_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(profile)
    db.session.commit()

    return jsonify({"message": "Profile deleted"}), 200


# update tutor profile (only owner can update)
@routes_bp.route("/tutor-profile/<int:id>", methods=["PATCH"])
@jwt_required()
def update_tutor_profile(id):
    user_id = get_jwt_identity()
    data = request.get_json()

    profile = TutorProfile.query.get(id)

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    # only the owner can update this profile
    if profile.user_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    # update only fields that were sent
    if "subject" in data:
        profile.subject = data["subject"]

    if "location" in data:
        profile.location = data["location"]

    if "hourly_rate" in data:
        profile.hourly_rate = data["hourly_rate"]

    if "bio" in data:
        profile.bio = data["bio"]

    db.session.commit()

    return jsonify({
        "message": "Tutor profile updated",
        "profile": {
            "id": profile.id,
            "subject": profile.subject,
            "location": profile.location,
            "hourly_rate": profile.hourly_rate,
            "bio": profile.bio
        }
    }), 200


# create booking (only students)
@routes_bp.route("/bookings", methods=["POST"])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()

    user = User.query.get(int(user_id))

    # only students can create bookings
    if not user or user.role != "student":
        return jsonify({"error": "Only students can create bookings"}), 403

    tutor_profile = TutorProfile.query.get(data.get("tutor_id"))

    if not tutor_profile:
        return jsonify({"error": "Tutor not found"}), 404

    booking = Booking(
        lesson_date=data.get("lesson_date"),
        student_id=user.id,
        tutor_id=tutor_profile.id
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "message": "Booking created",
        "booking": {
            "id": booking.id,
            "lesson_date": booking.lesson_date,
            "status": booking.status,
            "tutor": {
                "id": booking.tutor.id,
                "subject": booking.tutor.subject,
                "location": booking.tutor.location
            }
        }
    }), 201


# get bookings for current user (student)
@routes_bp.route("/bookings", methods=["GET"])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()

    # get all bookings for this student
    bookings = Booking.query.filter_by(student_id=int(user_id)).all()

    result = []

    for booking in bookings:
        result.append({
            "id": booking.id,
            "lesson_date": booking.lesson_date,
            "status": booking.status,
            "tutor": {
                "id": booking.tutor.id,
                "subject": booking.tutor.subject,
                "location": booking.tutor.location
            }
        })

    return jsonify(result), 200


# delete booking (only student who created it)
@routes_bp.route("/bookings/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_booking(id):
    user_id = get_jwt_identity()

    booking = Booking.query.get(id)

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # only the student who created the booking can delete it
    if booking.student_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(booking)
    db.session.commit()

    return jsonify({"message": "Booking deleted"}), 200


# update booking (only owner)
@routes_bp.route("/bookings/<int:id>", methods=["PATCH"])
@jwt_required()
def update_booking(id):
    user_id = get_jwt_identity()
    data = request.get_json()

    booking = Booking.query.get(id)

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    if booking.student_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    if "lesson_date" in data:
        booking.lesson_date = data["lesson_date"]

    if "status" in data:
        booking.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Booking updated",
        "booking": {
            "id": booking.id,
            "lesson_date": booking.lesson_date,
            "status": booking.status,
            "tutor": {
                "id": booking.tutor.id,
                "subject": booking.tutor.subject,
                "location": booking.tutor.location
            }
        }
    }), 200


# get bookings for current tutor
@routes_bp.route("/tutor-bookings", methods=["GET"])
@jwt_required()
def get_tutor_bookings():
    user_id = get_jwt_identity()

    # find tutor profile for this user
    tutor_profile = TutorProfile.query.filter_by(user_id=int(user_id)).first()

    if not tutor_profile:
        return jsonify({"error": "Tutor profile not found"}), 404

    bookings = Booking.query.filter_by(tutor_id=tutor_profile.id).all()

    result = []

    for booking in bookings:
        result.append({
            "id": booking.id,
            "lesson_date": booking.lesson_date,
            "status": booking.status,
            "student": {
                "id": booking.student.id,
                "username": booking.student.username
            }
        })

    return jsonify(result), 200