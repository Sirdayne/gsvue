import axios from 'axios'
import msgHandler from './msgHandler'
import Auth from './Auth'

const TIMEOUT = 5 * 60 * 1000

let api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  config.headers['Authorization'] = Auth.getToken()
  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use((response) => {
  return response
}, (error) => {
  let message = error.response.data && error.response.data.message ? error.response.data.message : error
  msgHandler.showError(message)
  return Promise.reject(error)
})

export default {
  get(path) {
    return api.get(path)
      .then((response) => {
        return response.data
      })
  }
}
