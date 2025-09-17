import React, { useState, useEffect } from "react";
import { AlertCircle, RefreshCw, Clock, Wifi, WifiOff } from "lucide-react";
import { Button } from "./ui/Button";
import healthCheckService from "../services/healthCheck";

const BackendStatus = () => {
  const [status, setStatus] = useState(healthCheckService.getStatus());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = healthCheckService.addListener((newStatus) => {
      setStatus(newStatus);

      if (!newStatus.isHealthy) {
        setIsVisible(true);
      } else if (newStatus.isHealthy && isVisible) {
        setTimeout(() => setIsVisible(false), 3000);
      }
    });

    return unsubscribe;
  }, [isVisible]);

  const handleRetry = () => {
    healthCheckService.checkHealth();
  };

  const getStatusMessage = () => {
    if (status.isChecking) {
      return {
        title: "Checking Backend Status...",
        message: "Verifying connection to our servers",
        icon: <RefreshCw className="h-5 w-5 animate-spin" />,
        type: "info",
      };
    }

    if (healthCheckService.isBackendWakingUp()) {
      return {
        title: "Backend is Waking Up",
        message:
          "Our servers are starting up. This usually takes 1-2 minutes. Please wait...",
        icon: <Clock className="h-5 w-5 animate-pulse" />,
        type: "warning",
      };
    }

    if (healthCheckService.isBackendDown()) {
      return {
        title: "Backend Temporarily Unavailable",
        message:
          "Our servers are currently down. We're working to restore service. Please try again in a few minutes.",
        icon: <WifiOff className="h-5 w-5" />,
        type: "error",
      };
    }

    return null;
  };

  const statusInfo = getStatusMessage();

  if (!isVisible || !statusInfo) {
    return null;
  }

  const getStatusColors = () => {
    switch (statusInfo.type) {
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-800",
          icon: "text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700 text-white",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-800",
          icon: "text-red-600",
          button: "bg-red-600 hover:bg-red-700 text-white",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
        };
    }
  };

  const colors = getStatusColors();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-down">
      <div
        className={`${colors.bg} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}
      >
        <div className="flex items-start gap-3">
          <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
            {statusInfo.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`${colors.text} font-semibold text-sm mb-1`}>
              {statusInfo.title}
            </h3>
            <p className={`${colors.text} text-xs leading-relaxed mb-3`}>
              {statusInfo.message}
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleRetry}
                size="sm"
                className={`${colors.button} text-xs px-3 py-1.5`}
                disabled={status.isChecking}
              >
                {status.isChecking ? (
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                Retry
              </Button>

              {status.lastCheck && (
                <span className={`${colors.text} text-xs opacity-75`}>
                  Last check: {status.lastCheck.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className={`${colors.text} opacity-60 hover:opacity-100 transition-opacity`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendStatus;
