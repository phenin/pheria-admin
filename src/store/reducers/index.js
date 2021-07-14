import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import user from './userReducer'
import template from './templateReducer'
import group from './groupPreducer'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  user,
  template,
  group
})

export default createRootReducer
