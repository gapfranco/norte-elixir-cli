import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ListGeneric from '~/src/components/ListGeneric'
import { isAdmin } from '~/src/services/userApi'
import { listAccounts } from '~/src/services/accountsApi'

class ListAccounts extends React.Component {
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
        title='Contas'
        detail='/account'
        list={listAccounts}
        size={10}
        width={'100%'}
        ro={this.state.ro}
        qry={[
          { key: 'id', name: 'Código', type: 'text' },
          { key: 'name', name: 'Nome', type: 'text' }
        ]}
        table={[
          {
            title: 'Código',
            width: 180,
            dataIndex: 'id'
          },
          {
            title: 'Name',
            dataIndex: 'name'
          }
        ]}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default withRouter(connect(mapStateToProps)(ListAccounts))
