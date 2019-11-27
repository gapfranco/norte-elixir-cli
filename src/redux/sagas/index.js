import { all, takeLatest } from 'redux-saga/effects'

import { Types as AuthTypes } from '~/src/redux/ducks/user'

import { setSession } from './user'

export default function * rootSaga () {
  yield all([takeLatest(AuthTypes.SET_REQUEST, setSession)])
}
