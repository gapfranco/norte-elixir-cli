import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ListGeneric from '~/src/components/ListGeneric'
import { listItems } from '~/src/services/itemsApi'

class ListItems extends React.Component {
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
        title='Itens de conformidade'
        detail='/item'
        id='key'
        base='items'
        list={listItems}
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
          },
          {
            title: 'Frequencia',
            dataIndex: 'freq'
          },
          {
            title: 'Data base',
            dataIndex: 'base'
          }
        ]}
      />
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default withRouter(connect(mapStateToProps)(ListItems))
