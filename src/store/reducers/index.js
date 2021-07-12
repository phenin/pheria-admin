import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import user from './userReducer'
import template from './templateReducer'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  user,
  template
})

export default createRootReducer
