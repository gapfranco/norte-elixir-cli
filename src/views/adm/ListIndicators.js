import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Checkbox } from 'antd'

import ListGeneric from '~/src/components/ListGeneric'
import { isAdmin } from '~/src/services/userApi'
import { listIndicators } from '~/src/services/indicatorsApi'

class ListIndicator extends React.Component {
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
        title='Indicadores'
        detail='/indicator'
        list={listIndicators}
        size={10}
        width={'100%'}
        ro={this.state.ro}
        qry={[
          { key: 'id', name: 'Código', type: 'number' },
          { key: 'name', name: 'Nome', type: 'text' }
        ]}
        table={[
          {
            title: 'Código',
            dataIndex: 'id'
          },
          {
            title: 'Name',
            dataIndex: 'name'
          },
          {
            title: 'Descrição',
            dataIndex: 'description'
          },
          {
            title: 'Desc',
            dataIndex: 'is_desc',
            width: 80,
            render: isDesc => <Checkbox checked={isDesc} />
          }
        ]}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default withRouter(connect(mapStateToProps)(ListIndicator))
