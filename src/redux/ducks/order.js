// Types
export const Types = {
  SET_ORDER: 'order/SET_ORDER'
}

const INITIAL_STATE = null

// reducers

export default function order (state = INITIAL_STATE, action) {
  if (action.type === Types.SET_ORDER) {
    return action.payload
  } else {
    return state
  }
}

// actions

export const Creators = {
  setOrder: item => ({
    type: Types.SET_ORDER,
    payload: item
  })
}
