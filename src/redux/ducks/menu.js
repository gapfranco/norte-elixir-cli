// Types
export const Types = {
  SET_MENU: 'menu/SET_MENU'
}

const INITIAL_STATE = true

// reducers

export default function menu (state = INITIAL_STATE, action) {
  if (action.type === Types.SET_MENU) {
    return action.payload
  } else {
    return state
  }
}

// actions

export const Creators = {
  setMenu: item => ({
    type: Types.SET_MENU,
    payload: item
  })
}
