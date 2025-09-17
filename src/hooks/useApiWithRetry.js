import { useState, useCallback } from "react";
import healthCheckService from "../services/healthCheck";

export const useApiWithRetry = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const makeRequest = useCallback(async (apiCall, options = {}) => {
    const {
      maxRetries = 3,
      retryDelay = 2000,
      showRetryMessage = true,
    } = options;

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 1) {
          await healthCheckService.checkHealth();
        }

        const result = await apiCall();
        return result;
      } catch (error) {
        lastError = error;

        const isBackendError =
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError") ||
          error.message.includes("fetch") ||
          error.code === "NETWORK_ERROR" ||
          error.status >= 500;

        if (isBackendError && attempt < maxRetries) {
          if (showRetryMessage) {
            setIsRetrying(true);
          }

          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * attempt)
          );

          if (showRetryMessage) {
            setIsRetrying(false);
          }
        } else {
          break;
        }
      }
    }

    throw lastError;
  }, []);

  return { makeRequest, isRetrying };
};
