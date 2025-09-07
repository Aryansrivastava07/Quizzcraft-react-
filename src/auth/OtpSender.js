// Get API base URL from environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function SendOtp(setOtp,mail) {
  try {
    const res = await fetch(`${API_BASE_URL}/send-otp`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({}) // optional: send data if needed
    });

    const data = await res.json();

    if (res.ok) {
      setOtp(data.message); // or whatever your OTP is
    } else {
      console.warn("Server responded with error:", data.message);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}