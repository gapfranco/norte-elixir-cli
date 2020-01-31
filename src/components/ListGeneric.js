import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Icon,
  Input,
  Button,
  Row,
  Card,
  Table,
  Tooltip
} from 'antd'
import queryString from 'query-string'

import BasePage from '~/src/components/BasePage'
import { bindActionCreators } from 'redux'
import { Creators as pageActions } from '~/src/redux/ducks/page'
import { Creators as orderActions } from '~/src/redux/ducks/order'
import { Creators as queryActions } from '~/src/redux/ducks/query'

class ListGeneric extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      loaded: false,
      data: null,
      search: this.props.query ? this.props.query.v : '',
      query: this.props.query,
      size: this.props.size || 10,
      style: { width: '100%', marginTop: '32px' },
      ro: this.props.ro || false
    }
  }

  componentDidMount () {
    const values = queryString.parse(this.props.location.search)
    const page = values.page ? parseInt(values.page, 10) : this.props.page || 1
    this.makeRequest(page, this.props.size, this.props.query)
  }

  makeRequest = (page, size) => {
    const qr = this.state.query
    this.props
      .list(page, size, qr)
      .then(res => {
        const data = res.data.data[this.props.base]
        this.setState({
          data: data.list,
          lastPage: data.lastPage || 1,
          page: data.page || 1,
          perPage: data.perPage || size,
          total: data.count ? parseInt(data.count, 10) : 0,
          loaded: true,
          style: { ...this.state.style, width: this.props.width || '100%' }
        })
      })
      .catch(error => {
        this.setState({ error, loaded: false })
      })
  }

  handleSearch = event => {
    this.setState({ search: event.target.value })
  }

  startSearch = () => {
    if (this.state.search) {
      this.props.pageActions.setPage(null)
      this.props.queryActions.setQuery(this.state.search)
      this.setState({ query: this.state.search }, () => {
        this.makeRequest(1, this.props.size)
      })
    } else {
      this.props.pageActions.setPage(null)
      this.props.queryActions.setQuery(null)
      this.setState({ query: null }, () => {
        this.makeRequest(1, this.props.size)
      })
    }
  }

  clearSearch = () => {
    this.props.pageActions.setPage(null)
    this.props.orderActions.setOrder(null)
    this.props.queryActions.setQuery(null)
    this.setState({ query: null, search: '' },
      () => {
        this.makeRequest(1, this.props.size)
      }
    )
  }

  handleClick = id => {
    this.props.history.push(`${this.props.detail}/${id}`)
  }

  truncate = (str, nr) => {
    const ending = '...'
    const mxw = str.split(' ')
    const nrw = str.split(' ', nr)
    if (mxw.length > nr) {
      return nrw.join(' ') + ending
    } else {
      return str
    }
  }

  onChangePage = page => {
    this.props.pageActions.setPage(page)
    this.makeRequest(page, this.props.size, this.props.query, this.props.order)
  }

  render () {
    const pagina = {
      pageSize: this.props.size,
      current: this.state.page,
      total: this.state.total,
      onChange: this.onChangePage
    }
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card title={this.props.title} className='card_data' style={this.state.style}>
          <div style={{ paddingBottom: '8px' }}>
            <Form layout='inline'>
              <Form.Item>
                <Tooltip placement='top' title={'Valor a buscar'}>
                  <Input
                    style={{ width: 400 }}
                    value={this.state.search}
                    prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder='Valor a buscar'
                    allowClear
                    onChange={this.handleSearch}
                  />
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Tooltip placement='bottom' title={'Inicia a busca'}>
                  <Button icon='search' onClick={this.startSearch} />
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Tooltip placement='bottom' title={'Limpa e cancela a busca'}>
                  <Button icon='close' onClick={this.clearSearch} />
                </Tooltip>
              </Form.Item>
              {!this.state.ro ? (
                <Form.Item>
                  <Tooltip placement='bottom' title={'Incluir novo registro'}>
                    <Button type='primary' icon='plus' onClick={() => this.handleClick('+')}>
                      Incluir
                    </Button>
                  </Tooltip>
                </Form.Item>
              ) : null}
            </Form>
          </div>
          <Table
            columns={this.props.table}
            dataSource={this.state.data}
            rowKey={record => record[this.props.id]}
            size='middle'
            bordered
            pagination={pagina}
            onRow={record => {
              return {
                onClick: () => {
                  this.handleClick(record[this.props.id])
                }
              }
            }}
          />
        </Card>
      </Row>
    )
  }
}

class ListPage extends React.Component {
  render () {
    return <BasePage component={<ListGeneric {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    pageActions: bindActionCreators(pageActions, dispatch),
    orderActions: bindActionCreators(orderActions, dispatch),
    queryActions: bindActionCreators(queryActions, dispatch)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListPage)
)
