import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add auth token interceptor
    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('auth_token');
          // TODO: Navigate to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  // ✅ Auth endpoints
  async register(email: string, password: string, fullName: string) {
    const response = await this.client.post('/auth/register', {
      email,
      password,
      fullName,
    });
    if (response.data.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  async updateProfile(fullName: string, tier: string) {
    const response = await this.client.put('/auth/profile', { fullName, tier });
    return response.data;
  }

  async logout() {
    await AsyncStorage.removeItem('auth_token');
  }

  // ✅ Transaction endpoints
  async createTransaction(data: {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    note: string;
    date: string;
    account: string;
  }) {
    const response = await this.client.post('/transactions', data);
    return response.data;
  }

  async getTransactions(month?: number, year?: number, type?: string) {
    const response = await this.client.get('/transactions', {
      params: { month, year, type },
    });
    return response.data;
  }

  async getTransaction(id: string) {
    const response = await this.client.get(`/transactions/${id}`);
    return response.data;
  }

  async updateTransaction(
    id: string,
    data: {
      amount?: number;
      type?: 'income' | 'expense';
      category?: string;
      note?: string;
      date?: string;
      account?: string;
    }
  ) {
    const response = await this.client.put(`/transactions/${id}`, data);
    return response.data;
  }

  async deleteTransaction(id: string) {
    const response = await this.client.delete(`/transactions/${id}`);
    return response.data;
  }

  async getStats(month?: number, year?: number) {
    const response = await this.client.get('/transactions/stats', {
      params: { month, year },
    });
    return response.data;
  }

  // ✅ Budget endpoints
  async createBudget(data: {
    categoryId: string;
    categoryName: string;
    limit: number;
    month: number;
    year: number;
  }) {
    const response = await this.client.post('/budgets', data);
    return response.data;
  }

  async getBudgets(month?: number, year?: number) {
    const response = await this.client.get('/budgets', {
      params: { month, year },
    });
    return response.data;
  }

  async updateBudget(id: string, limit: number) {
    const response = await this.client.put(`/budgets/${id}`, { limit });
    return response.data;
  }

  async deleteBudget(id: string) {
    const response = await this.client.delete(`/budgets/${id}`);
    return response.data;
  }
}

export const apiClient = new APIClient();
