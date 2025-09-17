const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL ||
  (import.meta.env.PROD
    ? "https://your-backend.onrender.com/api"
    : "http://localhost:5000/api");

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth headers with token
  getAuthHeaders(token) {
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response types
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(
          data.error ||
            data.message ||
            `Request failed with status ${response.status}`
        );
        error.status = response.status;
        error.code = response.status >= 500 ? "BACKEND_ERROR" : "CLIENT_ERROR";
        throw error;
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);

      // Enhance error with more context
      if (error.name === "AbortError") {
        const timeoutError = new Error(
          "Request timeout - backend may be starting up"
        );
        timeoutError.code = "TIMEOUT";
        timeoutError.status = 408;
        throw timeoutError;
      }

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        const networkError = new Error(
          "Cannot connect to backend - server may be down"
        );
        networkError.code = "NETWORK_ERROR";
        networkError.status = 0;
        throw networkError;
      }

      throw error;
    }
  }

  // Auth endpoints
  async getCurrentUser(token) {
    return this.request("/auth/me", {
      headers: this.getAuthHeaders(token),
    });
  }

  async syncUser(token) {
    return this.request("/auth/sync", {
      method: "POST",
      headers: this.getAuthHeaders(token),
    });
  }

  // Posts endpoints
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/posts${queryString ? `?${queryString}` : ""}`);
  }

  async searchPosts(searchQuery, params = {}) {
    const searchParams = { ...params, search: searchQuery };
    const queryString = new URLSearchParams(searchParams).toString();
    return this.request(`/posts${queryString ? `?${queryString}` : ""}`);
  }

  async getPost(id) {
    return this.request(`/posts/${id}`);
  }

  async createPost(postData, token) {
    return this.request("/posts", {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id, postData, token) {
    return this.request(`/posts/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id, token) {
    return this.request(`/posts/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });
  }

  // Comments endpoints
  async getComments(postId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/comments/posts/${postId}${queryString ? `?${queryString}` : ""}`
    );
  }

  async createComment(postId, commentBody, token) {
    return this.request(`/comments/posts/${postId}`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ body: commentBody }),
    });
  }

  async updateComment(id, commentBody, token) {
    return this.request(`/comments/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ body: commentBody }),
    });
  }

  async deleteComment(id, token) {
    return this.request(`/comments/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });
  }

  async getComment(id, token) {
    return this.request(`/comments/${id}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  async likeComment(id, token) {
    return this.request(`/comments/${id}/like`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
    });
  }

  async unlikeComment(id, token) {
    return this.request(`/comments/${id}/like`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });
  }

  async reportComment(id, reason, token) {
    return this.request(`/comments/${id}/report`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ reason }),
    });
  }

  // Users endpoints
  async getUserProfile(id) {
    return this.request(`/users/${id}`);
  }

  async updateUserProfile(userData, token) {
    return this.request("/users/me", {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(userData),
    });
  }

  async getUserPosts(token, includeDrafts = true) {
    return this.request(`/users/me/posts?includeDrafts=${includeDrafts}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  async getUserComments(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/users/me/comments${queryString ? `?${queryString}` : ""}`,
      {
        headers: this.getAuthHeaders(token),
      }
    );
  }

  // Settings endpoints
  async getUserSettings(token) {
    return this.request("/users/me/settings", {
      headers: this.getAuthHeaders(token),
    });
  }

  async updateUserSettings(settingsData, token) {
    return this.request("/users/me/settings", {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(settingsData),
    });
  }

  // Account management
  async deleteAccount(token) {
    return this.request("/users/me", {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });
  }

  // Upload endpoints
  async uploadImage(file, token) {
    const formData = new FormData();
    formData.append("image", file);

    const url = `${this.baseURL}/uploads`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Upload failed");
    }

    return data;
  }

  async uploadMultipleImages(files, token) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const url = `${this.baseURL}/uploads/multiple`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Upload failed");
    }

    return data;
  }

  // Health check
  async healthCheck() {
    return this.request("/health");
  }
}

export default new ApiService();
