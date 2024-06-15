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

const httpClient = {
  get(resource) {
    return apiURL.get(resource)
  },

  query(resource, params) {
    return apiURL.get(resource, { params })
  },

  post(resource, params) {
    return apiURL.post(`${resource}`, params)
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