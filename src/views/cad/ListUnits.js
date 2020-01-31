import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ListGeneric from '~/src/components/ListGeneric'
import { listUnits } from '~/src/services/unitsApi'

class ListUnits extends React.Component {
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
        title='Unidades'
        detail='/unit'
        id='key'
        base='units'
        list={listUnits}
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

export default withRouter(connect(mapStateToProps)(ListUnits))
