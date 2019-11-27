import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ListGeneric from '../../components/ListGeneric'
import { listUnits } from '../../api/unitApi'

class ListUnits extends React.Component {
  render () {
    return (
      <ListGeneric
        title='Unidades'
        detail='/unit'
        list={listUnits}
        size={5}
        qry={[
          { key: 'id', name: 'Código', type: 'text' },
          { key: 'name', name: 'Nome', type: 'text' }
        ]}
        table={[
          {
            name: 'Código',
            col: 'id',
            type: 'text',
            style: { width: '20%' }
          },
          {
            name: 'Nome',
            col: 'name',
            type: 'text',
            style: { width: '80%' }
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
