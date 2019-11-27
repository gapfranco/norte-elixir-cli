// Types
export const Types = {
  SET_QUERY: 'query/SET_QUERY'
}

const INITIAL_STATE = null

// reducers

export default function query (state = INITIAL_STATE, action) {
  if (action.type === Types.SET_QUERY) {
    return action.payload
  } else {
    return state
  }
}

// actions

export const Creators = {
  setQuery: item => ({
    type: Types.SET_QUERY,
    payload: item
  })
}
