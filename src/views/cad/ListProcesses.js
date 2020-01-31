import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ListGeneric from '~/src/components/ListGeneric'
import { listProcesses } from '~/src/services/processesApi'

class ListProcesses extends React.Component {
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
        title='Processos'
        detail='/process'
        id='key'
        base='processes'
        list={listProcesses}
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

export default withRouter(connect(mapStateToProps)(ListProcesses))
