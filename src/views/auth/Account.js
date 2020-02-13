import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Row, Card } from 'antd'
import BasePage from '~/src/components/BasePage'
import { me } from '~/src/services/authApi'
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

  componentDidMount () {
    me().then(res => {
      this.setState({
        me: res.data.data.me,
        ok: true
      })
    })
  }

  render () {
    if (!this.state.ok) {
      return null
    }
    return (
      <Row type='flex' justify='start' align='middle'>
        <Card
          title='Informações da conexão'
          className='card_data'
          style={{ width: 600 }}
        >
          <p><strong>Usuário</strong></p>
          <p>{this.state.me.uid} - {this.state.me.username}</p>
          <p><strong>E-Mail</strong></p>
          <p>{this.state.me.email}</p>
          <p><strong>Cliente</strong></p>
          <p>{this.state.me.client.cid} - {this.state.me.client.name}</p>
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
