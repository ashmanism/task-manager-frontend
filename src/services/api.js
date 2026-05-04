import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token"); // IMPORTANT: sessionStorage

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;