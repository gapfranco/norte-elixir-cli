import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Row,
  message,
  Card,
  Popconfirm,
  Col,
  Upload,
  Spin,
  Icon,
  Tabs
} from 'antd'

import BasePage from '~/src/components/BasePage'
import { isAdmin } from '~/src/services/userApi'
import SubListGeneric from '~/src/components/SubListGeneric'
import {
  showPeriod,
  updatePeriod,
  createPeriod,
  deletePeriod,
  loadPeriod,
  calcPeriod
} from '~/src/services/periodsApi'
import { listBalances } from '~/src/services/balancesApi'
import { listMeasures } from '~/src/services/measuresApi'
import { apiUrl } from '~/src/config/apiConfig'

class EditPeriod extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      account: null,
      open: false,
      props: {
        name: 'file',
        action: `${apiUrl}/files`,
        showUploadList: false,
        onChange: async info => {
          if (info.file.status === 'done') {
            await loadPeriod(this.props.match.params.id, info.file.response.id)
            this.setState({ spin: false })
            window.location.reload()
          } else if (info.file.status === 'error') {
            this.setState({ spin: false })
            message.error(`${info.file.name} file upload failed.`)
          } else {
            this.setState({ spin: true })
          }
        }
      }
    }
  }

  async componentDidMount () {
    // console.log(this.props.match)
    const id = this.props.match.params.id
    const admin = await isAdmin(this.props.user)
    if (id === '+') {
      this.setState({
        period: { id: '' },
        loaded: true,
        id: '',
        spin: false,
        admin
      })
    } else {
      showPeriod(id)
        .then(res => {
          this.setState({
            period: res.data,
            loaded: true,
            id: id,
            spin: false,
            admin
          })
        })
        .catch(() => {
          message.error('Erro na leitura do registro')
          this.setState({ loaded: true })
        })
    }
  }

  setStatus = async status => {
    console.log(this.state.id, status)
    await updatePeriod(this.state.id, { status })
  }

  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.state.id) {
          this.setState({ spin: true })
          createPeriod(values)
            .then(ret => {
              // this.props.history.goBack()
              this.setState({ period: ret.data })
              this.props.history.replace(`/period/${ret.data.id}`)
              window.location.reload()
            })
            .catch(() => {
              this.setState({ spin: false })
              message.error('Erro na criação do registro')
            })
        } else {
          updatePeriod(this.state.id, values)
            .then(() => {
              // this.props.form.resetFields()
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na atualização do periodo')
            })
        }
      }
    })
  }

  submitDelete = () => {
    deletePeriod(this.state.id)
      .then(() => {
        this.props.history.goBack()
      })
      .catch(() => {
        message.error('Erro na exclusão do registro')
      })
  }

  processIndicators = async () => {
    this.setState({ spin: true })
    await calcPeriod(this.state.id)
    this.setState({ spin: false })
    window.location.reload()
  }

  render () {
    const { getFieldDecorator } = this.props.form
    if (!this.state.loaded) {
      return null
    }
    let actions = []
    if (this.state.admin) {
      if (!this.state.id) {
        actions.push(
          <Button
            type='primary'
            disabled={this.state.spin}
            onClick={this.validSubmit}
          >
            Gravar
          </Button>
        )
      }
      if (this.state.id) {
        if (this.state.period.status === 0) {
          actions.push(
            <Upload {...this.state.props}>
              <Button type='primary' disabled={this.state.spin}>
                <Icon type='upload' />
                Carregar saldos
              </Button>
            </Upload>
          )
        }
        if (this.state.period.status === 1) {
          actions.push(
            <Popconfirm
              placement='top'
              title={'Confirme o processamento'}
              onConfirm={this.processIndicators}
              okText='Sim'
              cancelText='Não'
            >
              <Button type='primary' disabled={this.state.spin}>
                <Icon type='fund' />
                Processar indicadores
              </Button>
            </Popconfirm>
          )
        }
        actions.push(
          <Popconfirm
            placement='top'
            title={'Confirme a exclusão'}
            onConfirm={this.submitDelete}
            okText='Sim'
            cancelText='Não'
          >
            <Button type='danger' disabled={this.state.spin}>
              Excluir
            </Button>
          </Popconfirm>
        )
      }
    }
    actions.push(
      <Button
        disabled={this.state.spin}
        onClick={() => this.props.history.goBack()}
      >
        Voltar
      </Button>
    )
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card
          title='Período'
          className='card_data'
          style={{ width: '100%', marginTop: '32px' }}
          actions={actions}
        >
          <Form
            onSubmit={this.validSubmit}
            colon={false}
            className='change-form'
          >
            <Form.Item>
              <Row>
                <Col span={4}>
                  {getFieldDecorator('id', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o período no format AAAA-MM'
                      }
                    ],
                    initialValue: this.state.period.id
                  })(
                    <Input
                      placeholder='Período'
                      disabled={!this.state.admin || this.state.id !== ''}
                    />
                  )}
                </Col>
              </Row>
            </Form.Item>
          </Form>
          {this.state.id && (
            <Tabs defaultActiveKey='1'>
              <Tabs.TabPane
                tab={
                  <span>
                    <Icon type='dollar' />
                    Saldos
                  </span>
                }
                key='1'
              >
                <SubListGeneric
                  list={listBalances}
                  size={5}
                  id={this.state.id}
                  ro
                  key={'account_id'}
                  qry={[{ key: 'account_id', name: 'Código', type: 'text' }]}
                  table={[
                    {
                      title: 'Código',
                      width: 180,
                      dataIndex: 'account_id'
                    },
                    {
                      name: 'Nome',
                      dataIndex: 'account.name'
                    },
                    {
                      title: 'Saldo',
                      width: 180,
                      dataIndex: 'value',
                      align: 'right'
                    }
                  ]}
                />
              </Tabs.TabPane>

              <Tabs.TabPane
                tab={
                  <span>
                    <Icon type='dashboard' />
                    Indicadores
                  </span>
                }
                key='2'
              >
                <SubListGeneric
                  list={listMeasures}
                  size={5}
                  id={this.state.id}
                  key={'indicator_id'}
                  ro
                  qry={[
                    { key: 'indicator_id', name: 'Código', type: 'number' }
                  ]}
                  table={[
                    {
                      title: 'Código',
                      width: 180,
                      dataIndex: 'indicator_id'
                    },
                    {
                      name: 'Nome',
                      dataIndex: 'indicator.name'
                    },
                    {
                      title: 'Valor',
                      width: 180,
                      dataIndex: 'value',
                      align: 'right'
                    }
                  ]}
                />
              </Tabs.TabPane>
            </Tabs>
          )}
        </Card>
        <div style={{ marginTop: 16 }}>
          <Spin tip={'Aguarde...'} spinning={this.state.spin} />
        </div>
      </Row>
    )
  }
}

const EditPeriodForm = Form.create({ name: 'edit_user' })(EditPeriod)

class EditPeriodPage extends React.Component {
  render () {
    return <BasePage component={<EditPeriodForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(EditPeriodPage))
