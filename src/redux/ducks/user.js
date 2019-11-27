// Types
export const Types = {
  SET_REQUEST: 'user/SET_REQUEST',
  SET_SUCCESS: 'user/SET_SUCCESS',
  SIGN_OUT: 'user/SIGN_OUT'
}

const INITIAL_STATE = null

// reducers

export default function user (state = INITIAL_STATE, action) {
  if (action.type === Types.SET_REQUEST) {
    return state
  } else if (action.type === Types.SET_SUCCESS) {
    return action.payload
  } else if (action.type === Types.SIGN_OUT) {
    return null
  } else {
    return state
  }
}

// actions

export const Creators = {
  setSessionRequest: item => ({
    type: Types.SET_REQUEST,
    payload: item
  }),

  setSessionSuccess: item => ({
    type: Types.SET_SUCCESS,
    payload: item
  }),

  signOut: () => ({
    type: Types.SIGN_OUT
  })
}
