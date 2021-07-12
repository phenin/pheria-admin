import { get, customFetch } from './API'

const endpoints = {
  get: '/api/template',
  get_id: '/api/user/profile'
}

export const getList = (params) => get(endpoints.get, params)

export const fetchListTemplate = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(getList, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}
