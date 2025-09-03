export async function SendOtp(setOtp,mail) {
  try {
    const res = await fetch("http://localhost:5000/send-otp", {
      method: "POST", // <-- changed from GET to POST
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