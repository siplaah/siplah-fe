import { defineStore } from "pinia";
import { Auth } from '@/services/auth';

interface Employee {
  id: number;
  name: string;
  email: string;
  jabatan: string;
  cuti: number;
}

interface AuthState {
  isAuthenticated: boolean;
  employee: Employee | null;
  token: string;
  isLogout: boolean;
  loginFailed: boolean;
}

export const useAuthStore = defineStore('AuthStore', {
  state: (): AuthState => ({
    isAuthenticated: !!localStorage.getItem('employee'),
    employee: JSON.parse(localStorage.getItem('employee') || 'null') as Employee | null,
    token: localStorage.getItem('token') || '',
    isLogout: false,
    loginFailed: false,
  }),
  actions: {
    async login(email: string, password: string) {
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
      this.isLogout = true;
      localStorage.removeItem('employee');
      localStorage.removeItem('token');
    },

    initUser() {
      const employee = Auth.getCurrentUser();
      if (employee) {
        this.employee = employee;
        this.token = localStorage.getItem('token') || '';
        this.isAuthenticated = true;
      }
    },
  }
});
