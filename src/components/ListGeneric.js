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
  Select,
  Tooltip,
  DatePicker,
  InputNumber
} from 'antd'
import queryString from 'query-string'

import BasePage from '~/src/components/BasePage'
import { bindActionCreators } from 'redux'
import { Creators as pageActions } from '~/src/redux/ducks/page'
import { Creators as orderActions } from '~/src/redux/ducks/order'
import { Creators as queryActions } from '~/src/redux/ducks/query'
const moment = require('moment')

class ListGeneric extends React.Component {
  constructor (props) {
    super(props)
    const f = this.props.query ? this.props.query.f : ''
    const qf = this.props.qry.find(e => e.key === f)
    const type = qf ? qf.type || 'text' : 'text'
    this.state = {
      error: null,
      loaded: false,
      data: null,
      search: this.props.query ? this.props.query.v : '',
      field: this.props.query ? this.props.query.f : '',
      order: this.props.order ? this.props.order : '',
      oper: this.props.query ? this.props.query.q : '=',
      qry: this.props.qry,
      query: this.props.query,
      size: this.props.size || 10,
      style: { width: '100%', marginTop: '32px' },
      type,
      ro: this.props.ro || false,
      opr: [
        { key: '=', name: 'Igual a' },
        { key: '>', name: 'Maior que' },
        { key: '>=', name: 'Maior ou igual a' },
        { key: '<', name: 'Menor que' },
        { key: '<=', name: 'Menor ou igual a' },
        { key: 's', name: 'Inicia com' },
        { key: 'c', name: 'Contém' }
      ]
    }
  }

  componentDidMount () {
    const values = queryString.parse(this.props.location.search)
    const page = values.page ? parseInt(values.page, 10) : this.props.page || 1
    this.makeRequest(page, this.props.size, this.props.query, this.props.order)
  }

  makeRequest = (page, size, s = null) => {
    const qr = this.state.query
    this.props
      .list(page, size, qr, s)
      .then(res => {
        this.setState({
          data: res.data.data,
          lastPage: res.data.lastPage || 1,
          page: res.data.page || 1,
          perPage: res.data.perPage || size,
          total: res.data.total ? parseInt(res.data.total, 10) : 0,
          loaded: true,
          style: { ...this.state.style, width: this.props.width || '100%' }
        })
      })
      .catch(error => {
        this.setState({ error, loaded: false })
      })
  }

  handleField = value => {
    this.setState({ field: value, search: '' })
    const qf = this.state.qry.find(e => e.key === value)
    const type = qf ? qf.type || 'text' : 'text'
    this.setState({ type })
  }

  handleOper = value => {
    this.setState({ oper: value })
  }

  handleSearch = event => {
    // console.log(event)
    this.setState({ search: event.target.value })
  }

  handleSearchNumber = value => {
    this.setState({ search: value })
  }

  handleSearchDate = value => {
    this.setState({ search: value.format() })
  }

  startSearch = () => {
    if (this.state.field && this.state.search) {
      const qf = this.state.qry.find(e => e.key === this.state.field)
      let q = this.state.oper
      let v = this.state.search
      if (qf && qf.type && (qf.type === 'number' || qf.type === 'date')) {
        if (q === 's' || q === 'c') {
          q = '='
        }
        if (qf.type === 'number') {
          v = isNaN(v) ? 0 : v
        }
      }
      let qr = { f: this.state.field, q, v }
      this.props.pageActions.setPage(null)
      this.props.queryActions.setQuery(qr)
      this.setState({ query: qr }, () => {
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
    this.setState(
      { field: '', oper: '=', search: '', order: '', type: 'text', query: null },
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
      pageSize: this.state.size,
      current: this.state.page,
      total: this.state.total,
      onChange: this.onChangePage
    }
    const dateFormat = 'YYYY-MM-DD'
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card title={this.props.title} className='card_data' style={this.state.style}>
          <div style={{ paddingBottom: '8px' }}>
            <Form layout='inline'>
              <Form.Item>
                <Tooltip placement='top' title={'Campo a pesquisar'}>
                  <Select
                    value={this.state.field}
                    onChange={this.handleField}
                    style={{ width: 160 }}
                  >
                    <Select.Option value={''}>Buscar</Select.Option>
                    {this.state.qry.map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Tooltip placement='top' title={'Tipo de comparação'}>
                  <Select value={this.state.oper} onChange={this.handleOper} style={{ width: 150 }}>
                    {this.state.opr.map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Tooltip placement='top' title={'Valor a buscar'}>
                  {this.state.type === 'date' ? (
                    <DatePicker
                      value={this.state.search ? moment(this.state.search, dateFormat) : null}
                      format={dateFormat}
                      placeholder='Data a buscar'
                      onChange={this.handleSearchDate}
                    />
                  ) : null}
                  {this.state.type === 'number' ? (
                    <InputNumber
                      style={{ width: 320 }}
                      value={this.state.search}
                      placeholder='Valor a buscar'
                      onChange={this.handleSearchNumber}
                    />
                  ) : null}
                  {this.state.type === 'text' ? (
                    <Input
                      style={{ width: 320 }}
                      value={this.state.search}
                      type={this.state.type}
                      prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder='Valor a buscar'
                      allowClear
                      onChange={this.handleSearch}
                    />
                  ) : null}
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
            rowKey={record => record.id}
            size='middle'
            bordered
            pagination={pagina}
            onRow={record => {
              return {
                onClick: () => {
                  this.handleClick(record.id)
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
