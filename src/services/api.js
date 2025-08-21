import axios from "axios";

const API_BASE_URL = "https://division-management-api.onrender.com/api/v1/division-management";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Division API functions
export const divisionAPI = {
  // Get all divisions
  getAll: async () => {
    const response = await api.get("/divisions");
    return response.data;
  },

  // Get division by ID
  getById: async (id) => {
    const response = await api.get(`/divisions/${id}`);
    return response.data;
  },

  // Create new division
  create: async (divisionData) => {
    const response = await api.post("/divisions", divisionData);
    return response.data;
  },

  // Update division
  update: async (id, divisionData) => {
    const response = await api.put(`/divisions/${id}`, divisionData);
    return response.data;
  },

  // Delete division
  delete: async (id) => {
    const response = await api.delete(`/divisions/${id}`);
    return response.data;
  },
};

export default api;
