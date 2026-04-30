from flask import Blueprint, request, jsonify
from models import db, TutorProfile, User, Booking, Review
from flask_jwt_extended import jwt_required, get_jwt_identity

# create blueprint for main routes
routes_bp = Blueprint("routes", __name__, url_prefix="/api")


# Tutor profile routes


# create tutor profile (only tutors can create profiles)
@routes_bp.route("/tutor-profile", methods=["POST"])
@jwt_required()
def create_tutor_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    # find current user
    user = User.query.get(int(user_id))

    # check if user exists and has tutor role
    if not user or user.role != "tutor":
        return jsonify({"error": "Only tutors can create profile"}), 403

    # create new tutor profile
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

    # format tutor profiles for response
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


# delete tutor profile (only the owner can delete)
@routes_bp.route("/tutor-profile/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tutor_profile(id):
    user_id = get_jwt_identity()

    # find tutor profile by id
    profile = TutorProfile.query.get(id)

    # check if profile exists
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    # check ownership
    if profile.user_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(profile)
    db.session.commit()

    return jsonify({"message": "Profile deleted"}), 200


# update tutor profile (only the owner can update)
@routes_bp.route("/tutor-profile/<int:id>", methods=["PATCH"])
@jwt_required()
def update_tutor_profile(id):
    user_id = get_jwt_identity()
    data = request.get_json()

    # find tutor profile by id
    profile = TutorProfile.query.get(id)

    # check if profile exists
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    # check ownership
    if profile.user_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    # update fields if they exist in request
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


# Booking routes


# create booking (only students can create bookings)
@routes_bp.route("/bookings", methods=["POST"])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()

    # find current user
    user = User.query.get(int(user_id))

    # check if user exists and has student role
    if not user or user.role != "student":
        return jsonify({"error": "Only students can create bookings"}), 403

    # find tutor profile by id
    tutor_profile = TutorProfile.query.get(data.get("tutor_id"))

    # check if tutor profile exists
    if not tutor_profile:
        return jsonify({"error": "Tutor not found"}), 404

    # create new booking
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


# get bookings for current student
@routes_bp.route("/bookings", methods=["GET"])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()

    # get all bookings created by current student
    bookings = Booking.query.filter_by(student_id=int(user_id)).all()

    result = []

    # format bookings for response
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


# delete booking (only the student who created it can delete)
@routes_bp.route("/bookings/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_booking(id):
    user_id = get_jwt_identity()

    # find booking by id
    booking = Booking.query.get(id)

    # check if booking exists
    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # check ownership
    if booking.student_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(booking)
    db.session.commit()

    return jsonify({"message": "Booking deleted"}), 200


# update booking (only the student who created it can update)
@routes_bp.route("/bookings/<int:id>", methods=["PATCH"])
@jwt_required()
def update_booking(id):
    user_id = get_jwt_identity()
    data = request.get_json()

    # find booking by id
    booking = Booking.query.get(id)

    # check if booking exists
    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # check ownership
    if booking.student_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    # update fields if they exist in request
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

    # find tutor profile for current user
    tutor_profile = TutorProfile.query.filter_by(user_id=int(user_id)).first()

    # check if tutor profile exists
    if not tutor_profile:
        return jsonify({"error": "Tutor profile not found"}), 404

    # get all bookings for this tutor profile
    bookings = Booking.query.filter_by(tutor_id=tutor_profile.id).all()

    result = []

    # format tutor bookings for response
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


# Review routes


# create review (only students can create reviews)
@routes_bp.route("/reviews", methods=["POST"])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    data = request.get_json()

    # find current user
    user = User.query.get(int(user_id))

    # check if user exists and has student role
    if not user or user.role != "student":
        return jsonify({"error": "Only students can create reviews"}), 403

    # find tutor profile by id
    tutor_profile = TutorProfile.query.get(data.get("tutor_id"))

    # check if tutor profile exists
    if not tutor_profile:
        return jsonify({"error": "Tutor not found"}), 404

    # create new review
    review = Review(
        rating=data.get("rating"),
        comment=data.get("comment"),
        student_id=user.id,
        tutor_id=tutor_profile.id
    )

    db.session.add(review)
    db.session.commit()

    return jsonify({
        "message": "Review created",
        "review": {
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment,
            "tutor": {
                "id": review.tutor.id,
                "subject": review.tutor.subject
            }
        }
    }), 201


# get all reviews
@routes_bp.route("/reviews", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()

    result = []

    # format reviews for response
    for review in reviews:
        result.append({
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment,
            "student": {
                "id": review.student.id,
                "username": review.student.username
            },
            "tutor": {
                "id": review.tutor.id,
                "subject": review.tutor.subject
            }
        })

    return jsonify(result), 200


# delete review (only the student who created it can delete)
@routes_bp.route("/reviews/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_review(id):
    # get current user id from JWT token
    user_id = get_jwt_identity()

    # find review by id
    review = Review.query.get(id)

    # check if review exists
    if not review:
        return jsonify({"error": "Review not found"}), 404

    # check ownership
    if review.student_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({"message": "Review deleted"}), 200


# update review (only the student who created it can update)
@routes_bp.route("/reviews/<int:id>", methods=["PATCH"])
@jwt_required()
def update_review(id):
    # get current user id from JWT token
    user_id = get_jwt_identity()

    data = request.get_json()

    # find review by id
    review = Review.query.get(id)

    # check if review exists
    if not review:
        return jsonify({"error": "Review not found"}), 404

    # check ownership
    if review.student_id != int(user_id):
        return jsonify({"error": "Not authorized"}), 403

    # update fields if they exist in request
    if "rating" in data:
        review.rating = data["rating"]

    if "comment" in data:
        review.comment = data["comment"]

    db.session.commit()

    return jsonify({
        "message": "Review updated",
        "review": {
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment
        }
    }), 200