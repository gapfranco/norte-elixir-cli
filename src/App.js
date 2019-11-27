import React, { Component } from 'react'

import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { isAuthenticated } from './services/authApi'
import MainPage from './views/MainPage'
import SignIn from './views/auth/SignIn'
import SignUp from './views/auth/SignUp'
import ChangePassword from './views/auth/ChangePassword'
import ForgotPassword from './views/auth/ForgotPassword'
import NewPassword from './views/auth/NewPassword'
import ListUsers from './views/adm/ListUsers'
import EditUser from './views/adm/EditUser'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (!isAuthenticated()) {
        return <Redirect to='/signin' />
      } else {
        return <Component {...props} />
      }
    }}
  />
)

class App extends Component {
  render () {
    return (
      <div>
        <PrivateRoute exact path='/' component={MainPage} />
        <Route exact path='/signin' component={SignIn} />
        <Route exact path='/signup' component={SignUp} />
        <Route exact path='/forgotpassword' component={ForgotPassword} />
        <Route exact path='/newpassword' component={NewPassword} />
        <PrivateRoute exact path='/changepassword' component={ChangePassword} />
        <PrivateRoute exact path='/users' component={ListUsers} />
        <PrivateRoute path='/user/:id' component={EditUser} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default withRouter(connect(mapStateToProps)(App))
