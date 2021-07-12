import * as ActionTypes from '../actionTypes'
import {
  fetchListTemplate,
} from 'api/template'

export const getListTemplate = (params) => async (dispatch, getState) => {
  dispatch({
    type: ActionTypes.TEMPLATE_START,
    payload: {
      loading: true,
    }
  })

  try {
    const data = await fetchListTemplate(params)
    console.log(data.data)

    dispatch({
      type: ActionTypes.GET_LIST_TEMPLATE_SUCCESS,
      payload: {
        listTemplate: data.data.template,
        total: data.data.total,
        loading: false,
      }
    })
    return true
    
  } catch (error) {
    dispatch({
        type: ActionTypes.TEMPLATE_ERROR,
        payload: {
          error: error,
          loading: false,
        }
    })
    return false
  }

}
