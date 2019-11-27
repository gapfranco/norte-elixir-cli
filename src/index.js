import './config/reactotronConfig'
import React from 'react'

import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'

import { PersistGate } from 'redux-persist/integration/react'

import storeConfig from './redux/store'

const { store, persistor } = storeConfig()

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
