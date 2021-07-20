import * as ActionTypes from '../actionTypes'
import {
  fetchListGroup,
  fetchCreateGroup,
  fetchUpdateGroup,
  fetchDeleteGroup
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
    // console.log(data);

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
      // console.log("loading update")
    }
    else{
      await fetchCreateGroup(params)
      // console.log("loading")

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
  let url;
  if(group && group.image){
     url = group.image.slice(7);
  }
  const image =  group && group.image ? `${process.env.REACT_APP_API}/images/${url}`:null 
  console.log("Group  : ",group)
  const groupClone ={
    ...group,
    image
    // image: images
  }
  console.log("Group clone : ",groupClone)
  dispatch({
    type: ActionTypes.SET_GROUP,
    payload: {
      group: groupClone
    }
  })
}


export const deleteGroup = (params) => async (dispatch, getState) => {
  dispatch({
    type: ActionTypes.GROUP_START,
    payload: {
      loading: true,
    }
  })

  try {
    if(params._id){
      await fetchDeleteGroup(params)
      // console.log("deleting update")
    }
    else{
      return;

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