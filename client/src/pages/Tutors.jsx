import { useEffect, useState } from "react";
import { getTutors, createTutor, deleteTutor, createReview } from "../services/api";
import tutorsBg from "../assets/tutors-bg.jpg";

// Tutors page component
function Tutors() {
    // State for tutors list
    const [tutors, setTutors] = useState([]);

    // State for loading and error messages
    const [message, setMessage] = useState("Loading tutors...");

    // Get current user and token from localStorage
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // State for new tutor form
    const [newTutor, setNewTutor] = useState({
        subject: "",
        location: "",
        hourly_rate: "",
        bio: "",
    });

    // State for review form
    const [reviewData, setReviewData] = useState({
        rating: "",
        comment: "",
    });

    // State for search input
    const [searchTerm, setSearchTerm] = useState("");

    // Load tutors from backend
    async function loadTutors() {
        try {
            const data = await getTutors();

            console.log("TUTORS RESPONSE:", data);

            if (data.error) {
                setMessage(data.error);
            } else {
                setTutors(data);
                setMessage("");
            }
        } catch (error) {
            console.error("TUTORS ERROR:", error);
            setMessage("Something went wrong. Check the backend server.");
        }
    }

    // Load tutors when the page opens
    useEffect(() => {
        if (!token) {
            setMessage("You must login first");
            return;
        }

        loadTutors();
    }, [token]);

    // Handle tutor form input changes
    function handleChange(e) {
        setNewTutor({
            ...newTutor,
            [e.target.name]: e.target.value,
        });
    }

    // Handle create tutor form submit
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = await createTutor(newTutor);

            console.log("CREATE TUTOR RESPONSE:", data);

            if (data.error) {
                setMessage(data.error);
            } else {
                setMessage("Tutor profile created successfully!");

                setNewTutor({
                    subject: "",
                    location: "",
                    hourly_rate: "",
                    bio: "",
                });

                loadTutors();
            }
        } catch (error) {
            console.error("CREATE TUTOR ERROR:", error);
            setMessage("Something went wrong. Check the backend server.");
        }
    }

    // Handle delete tutor profile
    async function handleDelete(id) {
        try {
            const data = await deleteTutor(id);

            console.log("DELETE RESPONSE:", data);

            if (data.error) {
                setMessage(data.error);
            } else {
                setMessage("Tutor deleted successfully!");
                loadTutors();
            }
        } catch (error) {
            console.error("DELETE ERROR:", error);
            setMessage("Something went wrong. Check the backend server.");
        }
    }

    // Handle review form submit
    async function handleReviewSubmit(e, tutorId) {
        e.preventDefault();

        try {
            const data = await createReview({
                rating: Number(reviewData.rating),
                comment: reviewData.comment,
                tutor_id: tutorId,
            });

            console.log("REVIEW RESPONSE:", data);

            if (data.error) {
                setMessage(data.error);
            } else {
                setMessage("Review added!");

                setReviewData({
                    rating: "",
                    comment: "",
                });

                loadTutors();
            }
        } catch (error) {
            console.error("REVIEW ERROR:", error);
            setMessage("Error adding review");
        }
    }

    // Filter tutors by subject, location, bio, or tutor username
    const filteredTutors = tutors.filter((tutor) => {
        const searchText = searchTerm.toLowerCase();

        return (
            tutor.subject.toLowerCase().includes(searchText) ||
            tutor.location.toLowerCase().includes(searchText) ||
            tutor.bio?.toLowerCase().includes(searchText) ||
            tutor.tutor?.username.toLowerCase().includes(searchText)
        );
    });

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                padding: "20px",
                paddingTop: "60px",
                textAlign: "center",
                overflow: "hidden",
            }}
        >
            {/* Background image */}
            <img
                src={tutorsBg}
                alt="background"
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    top: 0,
                    left: 0,
                    zIndex: -2,
                }}
            />

            {/* Overlay for better readability */}
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.45)",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}
            />

            <h1>Find Your Tutor</h1>

            {/* Search input */}
            <input
                placeholder="Search by subject, location, or tutor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: "320px",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginBottom: "15px",
                    boxSizing: "border-box",
                    backgroundColor: "#e8f0fe",
                }}
            />

            {/* Show create form only for logged-in tutor users */}
            {token && user?.role === "tutor" && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "12px",
                        margin: "0 auto 20px auto",
                        width: "320px",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2>Create Tutor Profile</h2>

                    <input
                        name="subject"
                        placeholder="Subject"
                        value={newTutor.subject}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            marginBottom: "10px",
                            boxSizing: "border-box",
                            backgroundColor: "#e8f0fe",
                        }}
                    />


                    <input
                        name="location"
                        placeholder="Location"
                        value={newTutor.location}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            marginBottom: "10px",
                            boxSizing: "border-box",
                            backgroundColor: "#e8f0fe",
                        }}
                    />


                    <input
                        name="hourly_rate"
                        placeholder="Hourly Rate"
                        value={newTutor.hourly_rate}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            marginBottom: "10px",
                            boxSizing: "border-box",
                            backgroundColor: "#e8f0fe",
                        }}
                    />


                    <input
                        name="bio"
                        placeholder="Bio"
                        value={newTutor.bio}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            marginBottom: "10px",
                            boxSizing: "border-box",
                            backgroundColor: "#e8f0fe",
                        }}
                    />


                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#6C63FF",
                            color: "white",
                            border: "none",
                            padding: "10px",
                            width: "100%",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginTop: "5px",
                        }}
                    >
                        Create Tutor
                    </button>
                </form>
            )}

            {/* Show message only for logged-in students */}
            {token && user?.role !== "tutor" && (
                <p>You must be a tutor to create a profile.</p>
            )}

            {/* Message display */}
            {message && <p>{message}</p>}

            {/* Show message if search returns no tutors */}
            {filteredTutors.length === 0 && !message && (
                <p
                    style={{
                        backgroundColor: "white",
                        padding: "15px",
                        borderRadius: "12px",
                        width: "320px",
                        margin: "15px auto",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                        fontWeight: "bold",
                    }}
                >
                    No tutors found.
                </p>
            )}

            {/* Tutors list */}
            {filteredTutors.map((tutor) => (
                <div
                    key={tutor.id}
                    style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "20px",
                        margin: "15px auto",
                        width: "320px",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2>{tutor.subject}</h2>
                    <p>
                        <b>Location:</b> {tutor.location}
                    </p>
                    <p>
                        <b>Rate:</b> ${tutor.hourly_rate}/hour
                    </p>
                    <p>
                        <b>Bio:</b> {tutor.bio}
                    </p>
                    <p>
                        <b>Tutor:</b> {tutor.tutor?.username}
                    </p>

                    {/* Add review only for student users */}
                    {token && user?.role === "student" && (
                        <form onSubmit={(e) => handleReviewSubmit(e, tutor.id)}>
                            <input
                                placeholder="Rating (1-5)"
                                value={reviewData.rating}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    marginBottom: "8px",
                                    boxSizing: "border-box",
                                    backgroundColor: "#e8f0fe",
                                }}
                                onChange={(e) =>
                                    setReviewData({
                                        ...reviewData,
                                        rating: e.target.value,
                                    })
                                }
                            />

                            <input
                                placeholder="Comment"
                                value={reviewData.comment}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    marginBottom: "8px",
                                    boxSizing: "border-box",
                                    backgroundColor: "#e8f0fe",
                                }}
                                onChange={(e) =>
                                    setReviewData({
                                        ...reviewData,
                                        comment: e.target.value,
                                    })
                                }
                            />

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: "#6C63FF",
                                    color: "white",
                                    border: "none",
                                    padding: "8px",
                                    width: "100%",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    marginTop: "5px",
                                }}
                            >Add Review</button>
                        </form>
                    )}

                    {/* Reviews */}
                    <div style={{ marginTop: "10px" }}>
                        <b>Reviews:</b>

                        {tutor.reviews.length === 0 ? (
                            <p>No reviews yet</p>
                        ) : (
                            tutor.reviews.map((review) => (
                                <div
                                    key={review.id}
                                    style={{
                                        borderTop: "1px solid #ccc",
                                        marginTop: "5px",
                                        paddingTop: "5px",
                                    }}
                                >
                                    <p>Rating: {"⭐".repeat(parseInt(review.rating || 0))}</p>
                                    <br />
                                    {review.comment}
                                    <br />
                                    <small>by {review.student.username}</small>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Show delete button only for the owner of this tutor profile */}
                    {token && user?.id === tutor.tutor?.id && (
                        <button
                            onClick={() => handleDelete(tutor.id)}
                            style={{
                                marginTop: "10px",
                                backgroundColor: "#ff4d4f",
                                color: "white",
                                border: "none",
                                padding: "8px 14px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Tutors;