import { defineStore } from "pinia";
import { Auth } from '@/services/auth';

export const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('employee'),
    employee: JSON.parse(localStorage.getItem('employee')) || {},
    token: localStorage.getItem('token') || '',
    isLogout: false,
    loginFailed: false,
  }),
  actions: {
    async login(email, password) {
      try {
        const data = await Auth.login(email, password);
        this.employee = data.employee;
        this.token = data.accessToken;
        this.isAuthenticated = true;
        this.loginFailed = false;
        localStorage.setItem('employee', JSON.stringify(data.employee));
        localStorage.setItem('token', data.accessToken);
      } catch (error) {
        console.error('Failed to login', error);
        this.loginFailed = true;
        throw error;
      }
    },

    async logout() {
      try {
        await Auth.logout(this.token);
        this.resetAuth();
      } catch (error) {
        console.error('Failed to login', error);
        throw error;
      }
    },

    resetAuth() {
      this.employee = null;
      this.token = '';
      this.isAuthenticated = false;
      this.isLogout = true
      localStorage.removeItem('employee');
      localStorage.removeItem('token');
    },

    initUser() {
      const employee = Auth.getCurrentUser();
      if (employee) {
        this.employee = employee;
        this.token = localStorage.getItem('token');
        this.isAuthenticated = true;
      }
    },
  }
})