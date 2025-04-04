// lib/echo.js
import Echo from "laravel-echo";
import Pusher from "pusher-js";

if (typeof window !== "undefined") {
  window.Pusher = Pusher; // Make Pusher available globally
}

const echo = new Echo({
  broadcaster: "reverb",
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
  wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
  wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
  forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
  enabledTransports: ["ws", "wss"],
  disableStats: true, // Optional: Disables stats tracking
  authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL}/broadcasting/auth`, // If using authentication
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth method
    },
  },
});

export default echo;
