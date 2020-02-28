import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Row, message, Card, Popconfirm, Icon, Tabs, Select, DatePicker } from 'antd'
import BasePage from '~/src/components/BasePage'
import SubListGeneric from '~/src/components/SubListGeneric'

import { showItem, updateItem, createItem, deleteItem } from '~/src/services/itemsApi'
import { listMappings } from '~/src/services/mappingsApi'
import { errorAlert } from '~/src/services/utils'

const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'

const frequencies = [
  { key: 'diario', name: 'Diário' },
  { key: 'semanal', name: 'Semanal' },
  { key: 'mensal', name: 'Mensal' },
  { key: 'bimestral', name: 'Bimestral' },
  { key: 'trimestral', name: 'Trimestral' },
  { key: 'semestral', name: 'Semestral' },
  { key: 'anual', name: 'Anual' }
]

class EditItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      isLoading: false,
      user: null,
      open: false,
      tab: '1'
    }
  }

  componentDidMount () {
    const id = this.props.match.params.id
    if (id === '+') {
      this.setState({
        data: { key: '', name: '', freq: null, base: null },
        loaded: true,
        id: id
      })
    } else {
      showItem(id)
        .then(res => {
          this.setState({
            data: res.data.data.item,
            loaded: true,
            id
          })
        })
        .catch(() => {
          message.error('Erro na leitura do registro')
          this.setState({ loaded: true })
        })
    }
  }

  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ isLoading: true })
        if (this.props.match.params.id === '+') {
          createItem(values)
            .then(() => {
              this.setState({ isLoading: false })
              this.props.history.goBack()
            })
            .catch((err) => {
              this.setState({ isLoading: false })
              errorAlert('Erro', `Erro na criação. Verifique o formato do código (${err})`, 5)
            })
        } else {
          updateItem(values)
            .then(() => {
              this.setState({ isLoading: false })
              this.props.history.goBack()
            })
            .catch((err) => {
              this.setState({ isLoading: false })
              errorAlert('Erro', `Erro de gravação (${err})`, 5)
            })
        }
      }
    })
  }

  submitDelete = () => {
    deleteItem(this.state.data.key)
      .then(() => {
        message.error('Registro excluido')
        this.props.history.goBack()
      })
      .catch(() => {
        message.error('Erro na exclusão do registro')
      })
  }

  verifyId = (rule, value, callback) => {
    if (value && this.props.match.params.id === '+' && !value.match(/^[a-zA-Z0-9](\.?[a-zA-Z0-9])*$/)) {
      callback(new Error('Só deve conter letras, numeros e pontos (.)'))
    } else {
      callback()
    }
  }

  handlePeriod = value => {
    this.setState({ data: { ...this.state.data, freq: value } }, () => console.log(this.state.data))
  }

  handleBase = value => {
    this.setState({ data: { ...this.state.data, base: value.format(dateFormat) } }, () => console.log(this.state.data))
  }

  setTab = tab => {
    this.setState({ tab })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    if (!this.state.loaded) {
      return null
    }
    let actions = []
    if (this.state.tab === '1') {
      actions.push(
        <Button type='primary' onClick={this.validSubmit} loading={this.state.isLoading}>
          Gravar
        </Button>
      )
      if (this.state.id !== '+') {
        actions.push(
          <Popconfirm
            placement='top'
            title={'Confirme a exclusão'}
            onConfirm={this.submitDelete}
            okText='Sim'
            cancelText='Não'
          >
            <Button type='danger'>Excluir</Button>
          </Popconfirm>
        )
      }
      actions.push(<Button onClick={() => this.props.history.goBack()}>Voltar</Button>)
    }

    return (
      <Row type='flex' justify='start' align='middle' >
        <Card
          title='Item de conformidade'
          className='card_data'
          style={{ width: '100%' }}
          actions={actions}
        >
          <Form
            onSubmit={this.validSubmit}
            colon={false}
            layout={'vertical'}
          >
            <Form.Item label={'Código'}>
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message: 'Informe código da área (níveis separados por pontos: xxx.xxx.xxxx)'
                  },
                  {
                    validator: this.verifyId
                  }
                ],
                initialValue: this.state.data.key
              })(<Input placeholder='Código' style={{ width: '50%' }} disabled={this.props.match.params.id !== '+'} />)}
            </Form.Item>
            <Form.Item label={'Nome'}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o nome da área'
                  }
                ],
                initialValue: this.state.data.name
              })(<Input placeholder='Nome' />)}
            </Form.Item>

            <Tabs defaultActiveKey='1' onChange={this.setTab}>
              <Tabs.TabPane
                tab={
                  <span>
                    <Icon type='calendar' />
                    Programação
                  </span>
                }
                key='1'
              >

                <Form.Item label={'Periodicidade'}>
                  {getFieldDecorator('freq', {
                    rules: [
                      {
                        required: false,
                        message: 'Informe a periodicidade'
                      }
                    ],
                    initialValue: this.state.data.freq
                  })(
                    <Select
                      onChange={this.handlePeriod}
                      style={{ width: 160 }}
                    >
                      <Select.Option value={''}>Nenhuma</Select.Option>
                      {frequencies.map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label={'Data base'}>
                  {getFieldDecorator('base', {
                    rules: [
                      {
                        required: false,
                        message: 'Informe a data base'
                      }
                    ],
                    initialValue: this.state.data.base ? moment(this.state.data.base, dateFormat) : null
                  })(
                    <DatePicker
                      format={'DD/MM/YYYY'}
                      placeholder='Data base'
                      onChange={this.handleBase}
                    />
                  )}
                </Form.Item>

              </Tabs.TabPane>
              {this.state.id !== '+' && (
                <Tabs.TabPane
                  tab={
                    <span>
                      <Icon type='share-alt' />
                      Distribuição
                    </span>
                  }
                  key='2'
                >
                  <SubListGeneric
                    list={listMappings}
                    size={5}
                    id={this.state.id}
                    subkey='id'
                    search={false}
                    title={'Unidades e responsáveis'}
                    detail={`mappings/${this.state.id}`}
                    base='mappings'
                    table={[
                      {
                        title: 'Unidade',
                        width: '30%',
                        dataIndex: 'unit.name'
                      },
                      {
                        title: 'Responsável',
                        width: '30%',
                        dataIndex: 'user.uid'
                      },
                      {
                        title: 'Nome',
                        width: '40%',
                        dataIndex: 'user.username'
                      }
                    ]}
                  />
                </Tabs.TabPane>
              )}

            </Tabs>
          </Form>

        </Card>
      </Row>
    )
  }
}

const EditItemForm = Form.create({ name: 'edit_item' })(EditItem)

class EditItemPage extends React.Component {
  render () {
    return <BasePage component={<EditItemForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(EditItemPage))
