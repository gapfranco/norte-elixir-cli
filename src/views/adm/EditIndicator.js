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
  Tabs,
  Icon,
  Checkbox
} from 'antd'
import BasePage from '~/src/components/BasePage'
import { isAdmin } from '~/src/services/userApi'
import SubListGeneric from '~/src/components/SubListGeneric'
import { listReferences } from '~/src/services/referencesApi'

import {
  showIndicator,
  updateIndicator,
  createIndicator,
  deleteIndicator
} from '~/src/services/indicatorsApi'

class EditIndicator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      indicator: null,
      open: false
    }
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    const admin = await isAdmin(this.props.user)
    if (id === '+') {
      this.setState({
        indicator: { id: '', name: '' },
        loaded: true,
        id: 0,
        admin
      })
    } else {
      showIndicator(id)
        .then(res => {
          this.setState({
            indicator: res.data,
            loaded: true,
            id: parseInt(id, 10),
            admin
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
        if (!this.state.id) {
          createIndicator(values)
            .then(() => {
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na criação do indicador')
            })
        } else {
          updateIndicator(this.state.id, values)
            .then(() => {
              // this.props.form.resetFields()
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na atualização do indicador')
            })
        }
      }
    })
  }

  submitDelete = () => {
    deleteIndicator(this.state.indicator.id)
      .then(() => {
        message.error('Registro excluido')
        this.props.history.goBack()
      })
      .catch(() => {
        message.error('Erro na exclusão do registro')
      })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    if (!this.state.loaded) {
      return null
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 20,
          offset: 4
        }
      }
    }

    let actions = []
    if (this.state.admin) {
      actions.push(
        <Button type='primary' onClick={this.validSubmit}>
          Gravar
        </Button>
      )
      if (this.state.id) {
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
    }
    actions.push(
      <Button onClick={() => this.props.history.goBack()}>Voltar</Button>
    )
    return (
      <Row type='flex' justify='start' align='middle'>
        <Card
          title='Indicador'
          className='card_data'
          style={{ width: '100%', marginTop: '32px' }}
          actions={actions}
        >
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane
              tab={
                <span>
                  <Icon type='form' />
                  Detalhes
                </span>
              }
              key='1'
            >
              <Form
                {...formItemLayout}
                onSubmit={this.validSubmit}
                colon={false}
                className='change-form'
              >
                <Form.Item label={'Nome'}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o nome'
                      }
                    ],
                    initialValue: this.state.indicator.name
                  })(<Input placeholder='Nome' disabled={!this.state.admin} />)}
                </Form.Item>

                <Form.Item label={'Descrição'}>
                  {getFieldDecorator('description', {
                    initialValue: this.state.indicator.description
                  })(
                    <Input.TextArea
                      rows={4}
                      placeholder='Descrição'
                      disabled={!this.state.admin}
                    />
                  )}
                </Form.Item>

                <Form.Item label={'Significado'}>
                  {getFieldDecorator('meaning', {
                    initialValue: this.state.indicator.meaning
                  })(
                    <Input.TextArea
                      rows={4}
                      placeholder='Descrição'
                      disabled={!this.state.admin}
                    />
                  )}
                </Form.Item>

                <Form.Item label={'Fórmula'}>
                  {getFieldDecorator('formula', {
                    initialValue: this.state.indicator.formula
                  })(
                    <Input placeholder='Formula' disabled={!this.state.admin} />
                  )}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  {getFieldDecorator('is_desc', {
                    valuePropName: 'checked',
                    initialValue: this.state.indicator.is_desc
                  })(<Checkbox>Descendente</Checkbox>)}
                </Form.Item>
              </Form>
            </Tabs.TabPane>
            {this.state.id && (
              <Tabs.TabPane
                tab={
                  <span>
                    <Icon type='dashboard' />
                    Valores de referência
                  </span>
                }
                key='2'
              >
                <SubListGeneric
                  list={listReferences}
                  size={5}
                  id={this.state.id}
                  key1={'id'}
                  qry={[{ key: 'period', name: 'Período', type: 'string' }]}
                  detail={'reference'}
                  table={[
                    {
                      title: 'Período',
                      width: 200,
                      dataIndex: 'period'
                    },
                    {
                      title: 'Valor 1',
                      width: 180,
                      dataIndex: 'value1',
                      align: 'right'
                    },
                    {
                      title: 'Valor 2',
                      width: 180,
                      dataIndex: 'value2',
                      align: 'right'
                    }
                  ]}
                />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Card>
      </Row>
    )
  }
}

const EditIndicatorForm = Form.create({ name: 'edit_user' })(EditIndicator)

class EditIndicatorPage extends React.Component {
  render () {
    return <BasePage component={<EditIndicatorForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(EditIndicatorPage))
