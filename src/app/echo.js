import { axios } from "@/lib/axios";
import Echo from "laravel-echo";

import Pusher from "pusher-js";
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "reverb",
  key: process.meta.env.NEXT_PUBLIC_REVERB_APP_KEY,
  authorizer: (channel) => {
    return {
      authorize: (socketId, callback) => {
        axios
          .post("/api/broadcasting/auth", {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            callback(true, error);
          });
      },
    };
  },
  wsHost: process.meta.env.NEXT_PUBLIC_REVERB_HOST,
  wsPort: process.meta.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
  wssPort: process.meta.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
  forceTLS: (process.meta.env.NEXT_PUBLIC_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
});
