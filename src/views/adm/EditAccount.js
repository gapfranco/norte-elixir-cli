import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Row, message, Card, Popconfirm, Col } from 'antd'
import BasePage from '~/src/components/BasePage'
import { isAdmin } from '~/src/services/userApi'

import {
  showAccount,
  updateAccount,
  createAccount,
  deleteAccount
} from '~/src/services/accountsApi'

class EditAccount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      account: null,
      open: false
    }
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    const admin = await isAdmin(this.props.user)
    if (id === '+') {
      this.setState({
        account: { id: '', name: '' },
        loaded: true,
        id: 0,
        admin
      })
    } else {
      showAccount(id)
        .then(res => {
          this.setState({
            account: res.data,
            loaded: true,
            id: parseInt(id, 10),
            admin
          })
        })
        .catch(() => {
          message.error('Erro na leitura da conta')
          this.setState({ loaded: true })
        })
    }
  }

  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.state.id) {
          createAccount(values)
            .then(() => {
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na criação da conta')
            })
        } else {
          updateAccount(this.state.id, values)
            .then(() => {
              // this.props.form.resetFields()
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na atualização da conta')
            })
        }
      }
    })
  }

  submitDelete = () => {
    if (this.props.user.id === this.state.user.id) {
      message.error('Usuário não pode excluir a si mesmo')
    } else {
      deleteAccount(this.state.account.id)
        .then(() => {
          message.error('Registro excluido')
          this.props.history.goBack()
        })
        .catch(() => {
          message.error('Erro na exclusão do registro')
        })
    }
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
      <Row type='flex' justify='start' align='middle'>
        <Card
          title='Conta'
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
            <Form.Item label={'Código'}>
              <Row>
                <Col span={12}>
                  {getFieldDecorator('id', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o código da conta'
                      }
                    ],
                    initialValue: this.state.account.id
                  })(
                    <Input
                      placeholder='Código da conta'
                      disabled={!this.state.admin}
                    />
                  )}
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label={'Nome'}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o nome'
                  }
                ],
                initialValue: this.state.account.name
              })(<Input placeholder='Nome' disabled={!this.state.admin} />)}
            </Form.Item>

            {/* <Row type='flex' justify='space-around' align='middle'>
              {this.state.admin ? (
                <Button type='primary' htmlType='submit'>
                  Gravar
                </Button>
              ) : null}
              {this.state.admin && this.state.id ? (
                <Popconfirm
                  placement='top'
                  title={'Confirme a exclusão'}
                  onConfirm={this.submitDelete}
                  okText='Sim'
                  cancelText='Não'
                >
                  <Button type='danger'>Excluir</Button>
                </Popconfirm>
              ) : null}
              <Button onClick={() => this.props.history.goBack()}>Voltar</Button>
            </Row> */}
          </Form>
        </Card>
      </Row>
    )
  }
}

const EditAccountForm = Form.create({ name: 'edit_user' })(EditAccount)

class EditAccountPage extends React.Component {
  render () {
    return <BasePage component={<EditAccountForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(EditAccountPage))
