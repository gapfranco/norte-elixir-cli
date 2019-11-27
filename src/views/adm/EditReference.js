import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  message,
  Card,
  Popconfirm,
  Col
} from 'antd'
import BasePage from '~/src/components/BasePage'
import { isAdmin } from '~/src/services/userApi'

import {
  showReference,
  updateReference,
  createReference,
  deleteReference
} from '~/src/services/referencesApi'

class EditReference extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      reference: null,
      open: false
    }
  }

  async componentDidMount () {
    const indId = this.props.match.params.indicator
    const id = this.props.match.params.id
    const admin = await isAdmin(this.props.user)
    if (id === '+') {
      this.setState({
        reference: {
          period: '',
          value1: null,
          value21: null
        },
        loaded: true,
        id: 0,
        indId: parseInt(indId, 10),
        admin
      })
    } else {
      showReference(parseInt(id, 10))
        .then(res => {
          this.setState({
            reference: res.data,
            loaded: true,
            indId: parseInt(indId, 10),
            id: parseInt(id, 10),
            admin
          })
        })
        .catch(err => {
          console.log(err)
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
          const reg = { ...values, indicator_id: this.state.indId }
          console.log(reg)
          createReference(reg)
            .then(() => {
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na criação da referencia')
            })
        } else {
          updateReference(this.state.id, values)
            .then(() => {
              // this.props.form.resetFields()
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na atualização da referencia')
            })
        }
      }
    })
  }

  submitDelete = () => {
    deleteReference(this.state.id)
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
      <Row type='flex' justify='center' align='middle'>
        <Card
          title='Valores de referência'
          className='card_data'
          style={{ width: '80%', marginTop: '32px' }}
          actions={actions}
        >
          <Form
            {...formItemLayout}
            onSubmit={this.validSubmit}
            colon={false}
            className='change-form'
          >
            <Form.Item label={'Período'}>
              <Row>
                <Col span={6}>
                  {getFieldDecorator('period', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o período no format AAAA-MM'
                      }
                    ],
                    initialValue: this.state.reference.period
                  })(
                    <Input placeholder='Período' disabled={!this.state.admin} />
                  )}
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label={'Valor 1'}>
              <Row>
                <Col span={12}>
                  {getFieldDecorator('value1', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o valor 1'
                      }
                    ],
                    initialValue: this.state.reference.value1
                  })(<InputNumber decimalSeparator='.' precision={2} />)}
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label={'Valor 2'}>
              <Row>
                <Col span={12}>
                  {getFieldDecorator('value2', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o valor 2'
                      }
                    ],
                    initialValue: this.state.reference.value2
                  })(<InputNumber decimalSeparator='.' precision={2} />)}
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    )
  }
}

const EditReferenceForm = Form.create({ name: 'edit_user' })(EditReference)

class EditReferencePage extends React.Component {
  render () {
    return <BasePage component={<EditReferenceForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(EditReferencePage))
