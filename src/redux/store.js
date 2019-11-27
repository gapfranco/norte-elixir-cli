import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import reducers from './ducks'
import sagas from './sagas'

const persistConfig = {
  key: 'root',
  storage
}
const persistedReducer = persistReducer(persistConfig, reducers)

export default () => {
  let sagaMiddleware
  if (process.env.NODE_ENV === 'development') {
    sagaMiddleware = createSagaMiddleware({
      sagaMonitor: console.tron.createSagaMonitor()
    })
  } else {
    sagaMiddleware = createSagaMiddleware()
  }

  let store
  if (process.env.NODE_ENV === 'development') {
    store = createStore(
      persistedReducer,
      composeWithDevTools(
        applyMiddleware(sagaMiddleware),
        console.tron.createEnhancer()
      )
    )
  } else {
    store = createStore(
      persistedReducer,
      compose(applyMiddleware(sagaMiddleware))
    )
  }

  const persistor = persistStore(store)
  // persistor.purge()

  sagaMiddleware.run(sagas)

  return { store, persistor }
}
