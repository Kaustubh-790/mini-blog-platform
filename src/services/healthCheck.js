class HealthCheckService {
  constructor() {
    this.isHealthy = true;
    this.isChecking = false;
    this.lastCheck = null;
    this.checkInterval = null;
    this.listeners = new Set();
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryDelay = 2000;
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback({
          isHealthy: this.isHealthy,
          isChecking: this.isChecking,
          lastCheck: this.lastCheck,
          retryCount: this.retryCount,
        });
      } catch (error) {
        console.error("Health check listener error:", error);
      }
    });
  }

  async checkHealth() {
    if (this.isChecking) return;

    this.isChecking = true;
    this.notifyListeners();

    try {
      const API_BASE_URL =
        import.meta.env.VITE_BACKEND_API_URL ||
        (import.meta.env.PROD
          ? "https://mini-blog-platform-nzp4.onrender.com"
          : "http://localhost:5000/api");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        this.isHealthy = true;
        this.retryCount = 0;
        this.lastCheck = new Date();
      } else {
        throw new Error(`Health check failed: ${response.status}`);
      }
    } catch (error) {
      console.warn("Backend health check failed:", error.message);
      this.isHealthy = false;
      this.retryCount++;
      this.lastCheck = new Date();
    } finally {
      this.isChecking = false;
      this.notifyListeners();
    }
  }

  startPeriodicCheck(interval = 30000) {
    if (this.checkInterval) return;

    this.checkHealth();

    this.checkInterval = setInterval(() => {
      this.checkHealth();
    }, interval);
  }

  stopPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getStatus() {
    return {
      isHealthy: this.isHealthy,
      isChecking: this.isChecking,
      lastCheck: this.lastCheck,
      retryCount: this.retryCount,
    };
  }

  isBackendWakingUp() {
    return (
      !this.isHealthy &&
      this.retryCount > 0 &&
      this.retryCount <= this.maxRetries
    );
  }

  isBackendDown() {
    return !this.isHealthy && this.retryCount > this.maxRetries;
  }
}

export default new HealthCheckService();
