import axios from 'axios'
import msgHandler from './msgHandler'
import Auth from './Auth'
import { store } from '@/store'
import gm from '@/services/GlobalMethods'

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
  if (store.getters.getTenant)
    config.headers['X-TenantID'] = store.getters.getTenant
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
  },
  getVuex(path){
    return api.get(path)
      .then((response) => {
        const action = gm.capitalize(path)
        store.dispatch(`actionSet${action}`, response.data)
        return response.data
      })
  },
  post(path, data) {
    return api.post(path, data)
      .then((response) => {
        return response.data
      })
  },
  put(path, data) {
    return api.put(path, data)
      .then((response) => {
        return response.data
      })
  },
  delete(path, id) {
    let url = id !== undefined ? path + '/' + id : path
    return api.delete(url)
  }
}
