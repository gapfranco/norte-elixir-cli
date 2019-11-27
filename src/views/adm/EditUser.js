import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Icon, Input, Button, Row, Col, message, Card, Popconfirm, Checkbox } from 'antd'
import BasePage from '~/src/components/BasePage'

import { showUser, updateUser, createUser, deleteUser, isAdmin } from '~/src/services/userApi'

class EditUser extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      user: null,
      open: false
    }
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    const admin = await isAdmin(this.props.user)
    if (id === '+') {
      this.setState({
        user: { email: '', username: '', admin: false, block: false },
        loaded: true,
        id: 0,
        admin
      })
    } else {
      showUser(id)
        .then(res => {
          this.setState({
            user: res.data,
            loaded: true,
            id: parseInt(id, 10),
            admin
          })
        })
        .catch(() => {
          message.error('Erro na leitura do usuário')
          this.setState({ loaded: true })
        })
    }
  }

  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.state.id) {
          createUser(values)
            .then(() => {
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na criação do usuário')
            })
        } else {
          updateUser(this.state.id, values)
            .then(() => {
              // this.props.form.resetFields()
              this.props.history.goBack()
            })
            .catch(() => {
              message.error('Erro na atualização do usuário')
            })
        }
      }
    })
  }

  submitDelete = () => {
    if (this.props.user.id === this.state.user.id) {
      message.error('Usuário não pode excluir a si mesmo')
    } else {
      deleteUser(this.state.user.id)
        .then(() => {
          message.error('Registro excluido')
          this.props.history.goBack()
        })
        .catch(() => {
          message.error('Erro na exclusão do registro')
        })
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback(new Error('Senhas inconsistentes'))
    } else {
      callback()
    }
  }

  verifyPassword = (rule, value, callback) => {
    if (value && value.length < 6) {
      callback(new Error('Senha deve ter pelo menos 6 caracteres'))
    } else {
      callback()
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
      if (this.state.id && this.state.id !== this.props.user) {
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
    actions.push(<Button onClick={() => this.props.history.goBack()}>Voltar</Button>)
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card
          title='Usuário'
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
            <Form.Item label={'E-Mail'}>
              <Row>
                <Col span={12}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o email'
                      }
                    ],
                    initialValue: this.state.user.email
                  })(<Input placeholder='E-Mail' disabled={!this.state.admin} />)}
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label={'Nome'}>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o nome'
                  }
                ],
                initialValue: this.state.user.username
              })(<Input placeholder='Nome' disabled={!this.state.admin} />)}
            </Form.Item>
            {!this.state.id ? (
              <Form.Item label={'Senha'}>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Informe uma senha' },
                    {
                      validator: this.verifyPassword
                    }
                  ]
                })(
                  <Input.Password
                    prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    style={{ width: 400 }}
                    placeholder='Senha'
                  />
                )}
              </Form.Item>
            ) : null}
            {!this.state.id ? (
              <Form.Item label={'Confirma Senha'}>
                {getFieldDecorator('password_confirmation', {
                  rules: [
                    { required: true, message: 'Confirme a senha' },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(
                  <Input.Password
                    prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type='password'
                    style={{ width: 400 }}
                    placeholder='Confirme a senha'
                  />
                )}
              </Form.Item>
            ) : null}
            {this.state.id ? (
              <Form.Item {...tailFormItemLayout}>
                {getFieldDecorator('admin', {
                  valuePropName: 'checked',
                  initialValue: this.state.user.admin
                })(
                  <Checkbox disabled={!this.state.admin || this.state.id === this.props.user}>
                    Administrador
                  </Checkbox>
                )}
              </Form.Item>
            ) : null}
            {this.state.id ? (
              <Form.Item {...tailFormItemLayout}>
                {getFieldDecorator('block', {
                  valuePropName: 'checked',
                  initialValue: this.state.user.block
                })(
                  <Checkbox disabled={!this.state.admin || this.state.id === this.props.user}>
                    Usuário bloqueado
                  </Checkbox>
                )}
              </Form.Item>
            ) : null}
            {/* <Row type='flex' justify='space-around' align='middle'>
              {this.state.admin ? (
                <Button type='primary' htmlType='submit'>
                  Gravar
                </Button>
              ) : null}
              {this.state.admin && this.state.id && this.state.id !== this.props.user ? (
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

const EditUserForm = Form.create({ name: 'edit_user' })(EditUser)

class EditUserPage extends React.Component {
  render () {
    return <BasePage component={<EditUserForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(EditUserPage))
