import { combineReducers } from 'redux'

// import auth from './auth'
import user from './user'
import order from './order'
import page from './page'
import query from './query'
import menu from './menu'

export default combineReducers({
  user,
  order,
  page,
  query,
  menu
})
