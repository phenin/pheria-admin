// Archived
const combineReducers = (reducers, cb) => (state = {}, action) => {

  const finalState = Object.keys(reducers).reduce(
    (nextState, key) => {
      // Call the corresponding reducer function for a given key
      nextState[key] = reducers[key] (
        state[key],
        action
      )
      return nextState
    },
    state
  )

  if (typeof cb === 'function') {
      cb(finalState)
  }
  return finalState
}

export default combineReducers
