import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ListGeneric from '~/src/components/ListGeneric'
import { listUser, isAdmin } from '~/src/services/userApi'
import { Checkbox } from 'antd'

class ListUsers extends React.Component {
  state = {
    ro: false,
    loaded: false
  }

  async componentDidMount () {
    const admin = await isAdmin(this.props.user)
    this.setState({
      ro: !admin,
      loaded: true
    })
  }

  render () {
    if (!this.state.loaded) {
      return null
    }
    return (
      <ListGeneric
        title='Usuários'
        detail='/user'
        id='uid'
        base='users'
        list={listUser}
        size={10}
        width={'100%'}
        ro={this.state.ro}
        table={[
          {
            title: 'Id',
            width: 250,
            dataIndex: 'uid'
          },
          {
            title: 'Name',
            width: 450,
            dataIndex: 'username'
          },
          {
            title: 'E-Mail',
            dataIndex: 'email'
          },
          {
            title: 'Admin',
            dataIndex: 'admin',
            width: 120,
            render: admin => <Checkbox checked={admin} />
          },
          {
            title: 'Bloqueado',
            dataIndex: 'block',
            width: 120,
            render: block => <Checkbox checked={block} />
          }
        ]}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default withRouter(connect(mapStateToProps)(ListUsers))
