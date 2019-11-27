import { call, put } from 'redux-saga/effects'

import { getUserId } from '~/src/services/authApi'
import { Creators as UserActions } from '~/src/redux/ducks/user'

export function * setSession (action) {
  try {
    const user = yield call(getUserId)
    yield put(UserActions.setSessionSuccess(user))
  } catch (error) {
    console.log(error)
  }
}
