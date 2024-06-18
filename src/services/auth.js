import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const Auth = {
  async login(email, password) {
    const res = await axios.post(`${API_URL}/auth/sign-in`, {email, password});
    return res.data.data;
  },

  async logout(token) {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('employee'));
  },
}