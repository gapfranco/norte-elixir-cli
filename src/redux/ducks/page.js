// Types
export const Types = {
  SET_PAGE: 'page/SET_PAGE'
}

const INITIAL_STATE = null

// reducers

export default function page (state = INITIAL_STATE, action) {
  if (action.type === Types.SET_PAGE) {
    return action.payload
  } else {
    return state
  }
}

// actions

export const Creators = {
  setPage: item => ({
    type: Types.SET_PAGE,
    payload: item
  })
}
