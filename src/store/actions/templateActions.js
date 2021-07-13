import * as ActionTypes from '../actionTypes'
import {
  fetchListTemplate,
  fetchCreateTemplate,
  fetchUpdateTemplate
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

export const createUpdateTemplate = (params) => async (dispatch, getState) => {
  dispatch({
    type: ActionTypes.TEMPLATE_START,
    payload: {
      loading: true,
    }
  })

  try {
    if(params._id){
      await fetchUpdateTemplate(params)
    }
    else{
      await fetchCreateTemplate(params)
    }

    dispatch({
      type: ActionTypes.CREATE_TEMPLATE_SUCCESS,
      payload: {
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

export const setTemplate = (template) => async (dispatch, getState) => {
  console.log(template)
  dispatch({
    type: ActionTypes.SET_TEMPLATE,
    payload: {
      template: template
    }
  })
}
