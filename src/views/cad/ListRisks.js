import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ListGeneric from '~/src/components/ListGeneric'
import { listRisks } from '~/src/services/risksApi'

class ListRisks extends React.Component {
  state = {
    ro: false,
    loaded: false
  }

  async componentDidMount () {
    this.setState({
      loaded: true
    })
  }

  render () {
    if (!this.state.loaded) {
      return null
    }
    return (
      <ListGeneric
        title='Riscos'
        detail='/risk'
        id='key'
        base='risks'
        list={listRisks}
        size={10}
        width={'100%'}
        ro={this.state.ro}
        table={[
          {
            title: 'Código',
            width: 180,
            dataIndex: 'key'
          },
          {
            title: 'Nome',
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

export default withRouter(connect(mapStateToProps)(ListRisks))
