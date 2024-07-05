import axios from 'axios'

const baseAPIURL = import.meta.env.VITE_API_URL

const apiURL = axios.create({
  baseURL: baseAPIURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
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
  get(resource: string) {
    return apiURL.get(resource)
  },

  query(resource: string, params: any) {
    return apiURL.get(resource, { params })
  },

  post(resource: any, params: any) {
    return apiURL.post(`${resource}`, params)
  },

  update(resource: any, slug: any, params: any) {
    return apiURL.put(`${resource}/${slug}`, params)
  },

  put(resource: any, params: any) {
    return apiURL.put(`${resource}`, params)
  },

  patch(resource: any, params: any) {
    return apiURL.patch(`${resource}`, params)
  },

  delete(resource: string) {
    return apiURL.delete(resource)
  },
}

export default httpClient