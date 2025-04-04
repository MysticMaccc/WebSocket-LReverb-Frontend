"use client";

import { useResource } from "../resource";

const useNotification = (customUrl = null) => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const route = customUrl
    ? `/api/notifications/${customUrl}`
    : "/api/notifications";
  return {
    ...useResource({ baseURL, route }),
  };
};

export { useNotification };
