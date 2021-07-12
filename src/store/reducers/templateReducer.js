import * as ActionTypes from '../actionTypes'

const initialState = {
    token: null,
    listTemplate: [],
    total: 0,
    template: null,
    loading: false,
    error: null
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.TEMPLATE_ERROR:
        case ActionTypes.TEMPLATE_START:
        case ActionTypes.GET_LIST_TEMPLATE_SUCCESS:
            return {...state, ...action.payload};
            
        default:
            return state;
    }
}

export default reducer
