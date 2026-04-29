from flask import Blueprint, request, jsonify
from models import db, TutorProfile, User
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