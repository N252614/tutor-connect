const API_URL = "http://127.0.0.1:5000";

async function handleResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("SERVER RESPONSE:", text);
    return { error: "Backend returned non-JSON response. Check Flask terminal." };
  }
}

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

export async function getTutors() {
  const response = await fetch(`${API_URL}/api/tutors`);
  return handleResponse(response);
}