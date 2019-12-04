import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ListGeneric from '~/src/components/ListGeneric'
import { listAreas } from '~/src/services/areasApi'

class ListAreas extends React.Component {
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
        title='Áreas'
        detail='/area'
        list={listAreas}
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

export default withRouter(connect(mapStateToProps)(ListAreas))
