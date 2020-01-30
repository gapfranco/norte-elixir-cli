import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Icon, Input, Button, Row, message, Card } from 'antd'
import BasePage from '~/src/components/BasePage'
import { errorAlert } from '~/src/services/utils'
import { signOut } from '~/src/services/authApi'
import { bindActionCreators } from 'redux'

import { Creators as userActions } from '~/src/redux/ducks/user'

class Account extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ok: false,
      error: null
    }
  }

  handleDisconnect = () => {
    // e.preventDefault()
    // signOut()
    // this.props.userActions.signOut()
    this.props.history.push('/')
  };

  render () {
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card
          title='Informações da conexão'
          className='card_data'
          style={{ width: 500, marginTop: '32px' }}
        >
          <Row type='flex' justify='center' align='middle'>
            <Button type='primary' onClick={this.handleDisconnect}>
              Fechar
            </Button>
          </Row>
        </Card>
      </Row>
    )
  }
}

class AccountPage extends React.Component {
  render () {
    return <BasePage component={<Account {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountPage))
