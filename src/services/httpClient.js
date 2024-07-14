import axios from 'axios'
import { useRouter } from 'vue-router';

const baseAPIURL = import.meta.env.VITE_API_URL

const apiURL = axios.create({
  baseURL: baseAPIURL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  }
})

apiURL.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiURL.interceptors.response.use(
  response => response, 
  error => {
    if (error.response && error.response.status === 401 && error.response.data.message === 'jwt expired') {
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

const httpClient = {
  get(resource) {
    return apiURL.get(resource)
  },

  query(resource, params) {
    return apiURL.get(resource, { params })
  },

  post(resource, params) {
    return apiURL.post(resource, params, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
  },

  postFormData(resource, formData) {
    return apiURL.post(resource, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      }
    });
  },

  update(resource, slug, params) {
    return apiURL.put(`${resource}/${slug}`, params)
  },

  put(resource, params) {
    return apiURL.put(`${resource}`, params)
  },

  patch(resource, params) {
    return apiURL.patch(`${resource}`, params)
  },

  delete(resource) {
    return apiURL.delete(resource)
  },
}

export default httpClient