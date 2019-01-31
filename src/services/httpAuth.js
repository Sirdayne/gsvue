import axios from 'axios'
import msgHandler from './msgHandler'
import Auth from './Auth'

const TIMEOUT = 5 * 60 * 1000

let api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use((response) => {
  return response
}, (error) => {
  let message = error.response.data && error.response.data.message ? error.response.data.message : error
  msgHandler.showError(message)
  return Promise.reject(error)
})

export default {
  login(path, data) {
    return api.post(path, data)
      .then((response) => {
        Auth.setToken(response, data.longToken)
        msgHandler.showSuccess('Successfully logged in')
      })
  },
  register(path, data) {
    return api.post(path, data)
      .then((response) => {
        Auth.setToken(response)
        msgHandler.showSuccess('Successfully registered')
      })
  },
  post(path, data) {
    return api.post(path, data)
      .then((response) => {
        Auth.setToken(response, data.longToken)
        msgHandler.showSuccess('Successfully logged in')
      })
  }
}
