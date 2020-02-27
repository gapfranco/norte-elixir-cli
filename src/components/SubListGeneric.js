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

class SubListGeneric extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      loaded: false,
      data: null,
      search: this.props.query ? this.props.query.v : '',
      query: this.props.query,
      size: this.props.size || 10,
      style: { width: '100%', borderWidth: 0 },
      ro: this.props.ro || false
    }
  }

  componentDidMount () {
    const values = queryString.parse(this.props.location.search)
    const page = values.page ? parseInt(values.page, 10) : this.props.page || 1
    this.makeRequest(this.props.id, page, this.props.size, this.props.query)
  }

  makeRequest = (id, page, size) => {
    const qr = this.state.query
    this.props
      .list(id, page, size, qr)
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
      this.setState({ query: this.state.search }, () => {
        this.makeRequest(this.props.id, 1, this.props.size)
      })
    } else {
      this.setState({ query: null }, () => {
        this.makeRequest(this.props.id, 1, this.props.size)
      })
    }
  }

  clearSearch = () => {
    this.setState({ query: null, search: '' },
      () => {
        this.makeRequest(this.props.id, 1, this.props.size)
      }
    )
  }

  handleClick = id => {
    this.props.history.push(`/${this.props.detail}/${id}`)
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
    this.makeRequest(
      this.props.id,
      page,
      this.props.size,
      this.props.query,
      this.props.order
    )
  }

  render () {
    const pagina = {
      pageSize: this.state.size,
      current: this.state.page,
      total: this.state.total,
      onChange: this.onChangePage
    }
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card
          title={this.props.title}
          className='card_data'
          style={this.state.style}
        >
          <div style={{ paddingBottom: '8px', display: 'flex', flexDirection: 'row' }}>
            {this.props.search && (
            <>
              <Form.Item>
                <Tooltip placement='top' title={'Valor a buscar'}>
                  <Input
                    style={{ width: 320, marginRight: 8 }}
                    value={this.state.search}
                    type={this.state.type}
                    prefix={
                      <Icon
                        type='search'
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    placeholder='Valor a buscar'
                    allowClear
                    onChange={this.handleSearch}
                  />
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Tooltip placement='bottom' title={'Inicia a busca'}>
                  <Button icon='search' style={{ marginRight: 8 }}onClick={this.startSearch} />
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Tooltip placement='bottom' title={'Limpa e cancela a busca'}>
                  <Button icon='close' style={{ marginRight: 8 }}onClick={this.clearSearch} />
                </Tooltip>
              </Form.Item>
            </>
            )}
            {!this.state.ro ? (
              <Form.Item>
                <Tooltip placement='bottom' title={'Incluir novo registro'}>
                  <Button
                    type='primary'
                    icon='plus'
                    onClick={() => this.handleClick('+')}
                  >
                    Incluir
                  </Button>
                </Tooltip>
              </Form.Item>
            ) : null}
          </div>
          <Table
            columns={this.props.table}
            dataSource={this.state.data}
            rowKey={record => record[this.props.subkey]}
            size='middle'
            bordered
            pagination={pagina}
            onRow={record => {
              return {
                onClick: () => {
                  this.handleClick(record[this.props.subkey])
                }
              }
            }}
          />
        </Card>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(SubListGeneric))
