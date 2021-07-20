import { get, post, put, remove, customFetch } from './API'

const endpoints = {
  get: '/api/group-template/',
}

export const getList = (params) => get(endpoints.get, params)
export const create = (params) => post(endpoints.get, params)
export const update = (params) => put(`${endpoints.get}/${params._id}`, params)
export const hidden = (params) => remove(`${endpoints.get}/${params._id}`, params)

export const fetchListGroup = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(getList, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

export const fetchCreateGroup = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(create, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

export const fetchUpdateGroup = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(update, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

export const fetchDeleteGroup = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(hidden, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}
