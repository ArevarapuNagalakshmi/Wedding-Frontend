// Extract a user-friendly error message from various Axios / Error shapes
export function getErrorMessage(err) {
  if (!err) return "Server error. Please try again.";

  const data = err.response?.data;

  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (typeof data.error === "string" && data.error.trim()) return data.error;
    if (data.error && typeof data.error === "object" && typeof data.error.message === "string") return data.error.message;

    // Fallback: first string value or nested message
    for (const v of Object.values(data)) {
      if (typeof v === "string" && v.trim()) return v;
      if (v && typeof v === "object" && typeof v.message === "string") return v.message;
    }
  }

  if (typeof err.message === "string" && err.message.trim()) return err.message;

  return "Server error. Please try again.";
}
