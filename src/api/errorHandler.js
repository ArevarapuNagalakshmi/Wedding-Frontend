/**
 * Centralized API error handler
 * Provides consistent error messages and debugging information
 */

export const getErrorMessage = (error, defaultMessage = "An error occurred") => {
  // Handle different error types
  if (!error) return defaultMessage;

  // Axios error with response
  if (error.response) {
    const { status, data } = error.response;

    // Check for custom error message from backend
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    // Handle standard HTTP status codes
    switch (status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Your session has expired. Please log in again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "Conflict: This resource already exists or has been modified.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
        return "Bad Gateway. The server is temporarily unavailable.";
      case 503:
        return "Service Unavailable. Please try again later.";
      default:
        return `Error ${status}: ${data?.message || defaultMessage}`;
    }
  }

  // Network error (no response received)
  if (error.message === "Network Error") {
    return "Network error. Please check your internet connection.";
  }

  // Request error (no response)
  if (error.request && !error.response) {
    return "No response from server. Please check your connection.";
  }

  // Error in request setup
  if (error.message) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Log API errors with context
 */
export const logApiError = (endpoint, error, context = {}) => {
  console.group(`🚨 API Error: ${endpoint}`);
  console.error("Error:", error);
  console.error("Status:", error.response?.status);
  console.error("Message:", error.response?.data?.message);
  console.error("Context:", context);
  console.groupEnd();
};

/**
 * Handle profile-specific errors
 */
export const getProfileErrorMessage = (error) => {
  if (error.response?.status === 404) {
    return "Profile not found. A new profile will be created when you save.";
  }
  if (error.response?.status === 401) {
    return "Session expired. Please log in again to access your profile.";
  }
  return getErrorMessage(error, "Unable to load profile. Please try again.");
};
