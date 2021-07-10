import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from './utils/logger'
import monitorReducersEnhancer from './utils/monitorReducer'
import updateUrlSearchParamsMiddleware from './utils/updateUrlSearchParamsMiddleware'

import createRootReducer from './reducers'

const basepath = process.env.REACT_APP_BASE_URL === '.' ? undefined : `/${process.env.REACT_APP_BASE_URL}`

export const history = createBrowserHistory({
    basename: basepath
})

const configureStore = (preloadedState) => {
  let middlewares = [routerMiddleware(history), thunkMiddleware, updateUrlSearchParamsMiddleware]
  if (process.env.REACT_APP_ENV === 'development') {
    //   middlewares.push(loggerMiddleware)
  }

  const middlewareEnhancer = applyMiddleware(...middlewares)

  let enhancers = [middlewareEnhancer]
  if (process.env.REACT_APP_ENV === 'development') {
      enhancers.push(monitorReducersEnhancer)
  }

  const composedEnhancers = compose(...enhancers)

  const store = createStore(createRootReducer(history), preloadedState, composedEnhancers)

  return store
}

export default configureStore
