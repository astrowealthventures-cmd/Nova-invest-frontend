import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://nova-invest-backend-production.up.railway.app";

console.log(
  `[api] using backend: ${BACKEND_URL} (source: ${import.meta.env.VITE_BACKEND_URL ? "env var" : "hardcoded fallback"
  })`
);

export const API = `${BACKEND_URL}/api`;

export const http = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Guards against a specific misconfiguration failure mode: if VITE_BACKEND_URL
// is wrong/unset, requests resolve to a relative path on the frontend's own
// domain. Since the SPA rewrite (vercel.json) serves index.html for any
// unmatched path, that request "succeeds" with a 200 and an HTML body instead
// of failing outright - so pages then try to .map() over an HTML string and
// crash. This turns that silent failure into a normal caught error instead.
http.interceptors.response.use(
  (response) => {
    if (typeof response.data === "string" && response.data.trim().startsWith("<")) {
      return Promise.reject(
        new Error(
          "Received HTML instead of JSON from the API - VITE_BACKEND_URL is likely misconfigured."
        )
      );
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export function fmtError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const money = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });