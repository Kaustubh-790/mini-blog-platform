import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility function to convert HTTP URLs to HTTPS for images
export function ensureHttpsUrl(url) {
  if (!url) return url;

  // If it's already HTTPS, return as is
  if (url.startsWith("https://")) {
    return url;
  }

  // If it's HTTP, convert to HTTPS
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }

  // If it's a relative URL or doesn't start with protocol, return as is
  return url;
}
