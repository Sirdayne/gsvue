import { store } from '@/store'
import moment from 'moment'
import httpQuery from '@/services/httpQuery'

export default {
  hasRole(role) {
    const storedAuthorities = localStorage.getItem('authorities')
    const parsedAuthorities = storedAuthorities ? JSON.parse(storedAuthorities) : []
    let found = false
    if (store.getters.getUserInfo && store.getters.getUserInfo.authorities && store.getters.getUserInfo.authorities.findIndex(a => a.authority === role) !== -1) {
      found = true
    }
    if (parsedAuthorities && parsedAuthorities.findIndex(a => a.authority === role) !== -1) {
      found = true
    }
    return found
  },
  getEntity(entities, id, key = 'id') {
    let found = entities.find(entity => entity[key] === id)
    return found
  },
  getEntityByKey(entities, id, key = 'id', returnKey = 'name') {
    let entity = this.getEntity(entities, id, key)
    let output = entity && entity[returnKey] ? entity[returnKey] : 'No Data'
    return output
  },
  capitalize(str) {
    return str[0].toUpperCase() + str.slice(1)
  },
  deepClone(item) {
    if (Array.isArray(item)) {
      return item.map(i => this.deepClone(i))
    } else if (Object.prototype.toString.call(item) == "[object Date]") {
      return new Date(item)
    } else if (Object.prototype.toString.call(item) == "[object RegExp]") {
      return new RegExp(item)
    } else if (Object.prototype.toString.call(item) == "[object Function]") {
      return (function() {
        item.apply(this, arguments)
      })
    } else if (item instanceof moment) {
      return item.clone()
    } else if (Object.prototype.toString.call(item) == "[object Object]") {
      let obj = {}
      Object.keys(item).forEach(key => {
        obj[key] = this.deepClone(item[key])
      })
      return obj
    }
    return item
  },
  getFromBool(val) {
    return val === true ? 'Yes' : 'No'
  },
  fetchEntity(entity) {
    return new Promise((resolve, reject) => {
      httpQuery.get(entity).then((data) => {
        const payload = {
          state: entity,
          data: data
        }
        store.dispatch('actionSetEntity', payload)
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  fromVuex(entity) {
    return store.getters.getEntity(entity)
  }
}
