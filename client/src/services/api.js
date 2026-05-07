const API_URL = "http://127.0.0.1:5000";

// Helper to safely parse backend response
async function handleResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("SERVER RESPONSE:", text);
    return { error: "Backend returned non-JSON response. Check Flask terminal." };
  }
}

// Register user
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

// Login user
export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

// Get all tutors
export async function getTutors() {
  const response = await fetch(`${API_URL}/api/tutors`);
  return handleResponse(response);
}

// Create new tutor profile (PROTECTED ROUTE)
export async function createTutor(tutorData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/tutor-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Send JWT token to backend
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tutorData),
  });

  return handleResponse(response);
}

// Delete tutor profile (PROTECTED ROUTE)
export async function deleteTutor(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/tutor-profile/${id}`, {
    method: "DELETE",
    headers: {
      // Send JWT token to backend
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

// Create new review (PROTECTED ROUTE)
export async function createReview(reviewData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  return handleResponse(response);
}