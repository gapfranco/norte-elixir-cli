import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Tag } from 'antd'

import ListGeneric from '~/src/components/ListGeneric'
import { isAdmin } from '~/src/services/userApi'
import { listPeriods } from '~/src/services/periodsApi'

class ListPeriods extends React.Component {
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
        title='Períodos'
        detail='/period'
        list={listPeriods}
        size={10}
        width={'100%'}
        ro={this.state.ro}
        qry={[{ key: 'id', name: 'Período', type: 'text' }]}
        table={[
          {
            title: 'Período',
            dataIndex: 'id'
          },
          {
            title: 'Situação',
            width: 240,
            dataIndex: 'status',
            render: status => (
              <span>
                {status === 0 ? (
                  <Tag color={'green'}>Novo</Tag>
                ) : status === 1 ? (
                  <Tag color={'purple'}>Saldos</Tag>
                ) : (
                  <span>
                    <Tag color={'purple'}>Saldos</Tag>
                    <Tag color={'blue'}>Indicadores</Tag>
                  </span>
                )}
                {/* <Tag color={['green', 'purple', 'geekblue'][status]}>
                  {['Novo', 'Saldos', 'Indicadores'][status]}
                </Tag> */}
              </span>
            )
          }
        ]}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default withRouter(connect(mapStateToProps)(ListPeriods))
