import { get, post, customFetch } from './API'

const endpoints = {
  login: '/api/user/login-by-admin',
  get_user: '/api/user/profile'
}

export const login = (params) => post(endpoints.login, params, { token_required : false })
export const getUser = () => get(endpoints.get_user)

export const fetchLogin = (params) => {
  return new Promise((resolve, reject) => {
    customFetch(login, params)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

export const fetchUser = () => {
  return new Promise((resolve, reject) => {
    customFetch(getUser)
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}
