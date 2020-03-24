import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Tag, Icon } from 'antd'
import ListGeneric from '~/src/components/ListGeneric'
import { listRatings } from '~/src/services/ratingsApi'
import moment from 'moment'

class ListRatings extends React.Component {
  state = {
    ro: true,
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
        title='Testes de conformidade'
        detail='/rating'
        id='id'
        base='ratings'
        list={listRatings}
        size={10}
        width={'100%'}
        ro={this.state.ro}
        table={[
          {
            title: 'Data',
            width: 140,
            dataIndex: 'dateDue',
            render: text => moment(text).format('DD/MM/YYYY')
          },
          {
            title: 'Código',
            width: 180,
            dataIndex: 'item.key'
          },
          {
            title: 'Nome',
            dataIndex: 'item.name'
          },
          {
            title: 'Respondido',
            width: 140,
            dataIndex: 'dateOk',
            render: text => (text ? moment(text).format('DD/MM/YYYY') : '')
          },
          {
            title: 'Resultado',
            width: 240,
            dataIndex: 'result',
            render: text => (
              <span>
                {text === 'conforme' ? (
                  <Tag color={'blue'}>Conforme</Tag>
                ) : text === 'falhou' ? (
                  <Tag color={'red'}>Falhou</Tag>
                ) : (
                  <Icon type='question-circle' />
                )}
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

export default withRouter(connect(mapStateToProps)(ListRatings))
