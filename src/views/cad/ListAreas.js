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
        id='key'
        base='areas'
        list={listAreas}
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

export default withRouter(connect(mapStateToProps)(ListAreas))
