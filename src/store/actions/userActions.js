import * as ActionTypes from '../actionTypes'
import {
  fetchLogin,
  fetchUser
} from 'api/user'
import { setCookie } from 'utils/util'

export const login = (params) => async (dispatch, getState) => {
  dispatch({
    type: ActionTypes.USER_START,
    payload: {
      loading: true,
    }
  })

  try {
    const data = await fetchLogin(params)

    setCookie('accessToken', data.data.token.accessToken)
    setCookie('refreshToken', data.data.token.refreshToken)

    dispatch({
      type: ActionTypes.LOGIN_SUCCESS,
      payload: {
        token: data,
        loading: false,
      }
    })
    return true
    
  } catch (error) {
    dispatch({
        type: ActionTypes.USER_ERROR,
        payload: {
          error: error,
          loading: false,
        }
    })
    return false
  }

}

export const getUser = (params) => async (dispatch, getState) => {
  dispatch({
    type: ActionTypes.USER_START,
    payload: {
      loading: true,
    }
  })

  try {
    
    const data = await fetchUser(params)
    dispatch({
      type: ActionTypes.GET_USER_SUCCESS,
      payload: {
        user: data.data,
        loading: false,
      }
    })
  } catch (error) {
      dispatch({
          type: ActionTypes.USER_ERROR,
          payload: {
            error: error,
            dataLoading: false,
          }
      })
  }

}