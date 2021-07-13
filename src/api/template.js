import { get, post, put, customFetch } from './API'

const endpoints = {
  get: '/api/template',
}

export const getList = (params) => get(endpoints.get, params)
export const create = (params) => post(endpoints.get, params)
export const update = (params) => put(`${endpoints.get}/${params._id}`, params)

export const fetchListTemplate = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(getList, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

export const fetchCreateTemplate = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(create, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

export const fetchUpdateTemplate = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(update, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

