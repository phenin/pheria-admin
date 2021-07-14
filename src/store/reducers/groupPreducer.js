import * as ActionTypes from '../actionTypes'

const initialState = {
    listGroup: [],
    total: 0,
    group: null,
    loading: false,
    error: null
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.GROUP_ERROR:
        case ActionTypes.GROUP_START:
        case ActionTypes.GET_LIST_GROUP_SUCCESS:
        case ActionTypes.SET_GROUP:
        case ActionTypes.CREATE_GROUP_SUCCESS:
        case ActionTypes.UPDATE_GROUP_SUCCESS:
        case ActionTypes.DELETE_GROUP_SUCCESS:
            console.log({...state, ...action.payload});
            return {...state, ...action.payload};
            
        default:
            return state;
    }
}

export default reducer
