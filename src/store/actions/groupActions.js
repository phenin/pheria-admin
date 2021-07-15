import * as ActionTypes from '../actionTypes'
import {
  fetchListGroup,
  fetchCreateGroup,
  fetchUpdateGroup
} from 'api/group'

export const getListGroup = (params) => async (dispatch, getState) => {
  dispatch({
    type: ActionTypes.GROUP_START,
    payload: {
      loading: true,
    }
  })

  try {
    const data = await fetchListGroup(params)
    console.log(data);

    dispatch({
      type: ActionTypes.GET_LIST_GROUP_SUCCESS,
      payload: {
        listGroup: data.data.groupTemplate,
        total: data.data.total,
        loading: false,
      }
    })
    return true
    
  } catch (error) {
    dispatch({
        type: ActionTypes.GROUP_ERROR,
        payload: {
          error: error,
          loading: false,
        }
    })
    return false
  }

}

export const createUpdateGroup = (params) => async (dispatch, getState) => {
  dispatch({
    type: ActionTypes.GROUP_START,
    payload: {
      loading: true,
    }
  })

  try {
    if(params._id){
      await fetchUpdateGroup(params)
      console.log("loading update")
    }
    else{
      await fetchCreateGroup(params)
      console.log("loading")

    }

    dispatch({
      type: ActionTypes.CREATE_GROUP_SUCCESS,
      payload: {
        loading: false,
      }
    })
    return true
    
  } catch (error) {
    dispatch({
        type: ActionTypes.GROUP_ERROR,
        payload: {
          error: error,
          loading: false,
        }
    })
    return false
  }

}

export const setGroup = (group) => async (dispatch, getState) => {
  
  const images =group && group.image.map(image => {
    return {
      ...image,
      url: image.url ? `${process.env.REACT_APP_API}/${image.url}` : image
    }
  })
  const groupClone ={
    ...group,
    image: images
  }
  console.log(groupClone)
  dispatch({
    type: ActionTypes.SET_GROUP,
    payload: {
      group: groupClone
    }
  })
}
