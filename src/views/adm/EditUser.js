import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Row, message, Card, Popconfirm, Checkbox, Col } from 'antd'
import BasePage from '~/src/components/BasePage'

import { showUser, updateUser, createUser, deleteUser, isAdmin } from '~/src/services/userApi'
import { welcome } from '~/src/services/authApi'
import { validEmail } from '~/src/services/validators'
import { errorAlert } from '~/src/services/utils'

class EditUser extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      isLoading: false,
      user: null,
      open: false
    }
  }

  async componentDidMount () {
    const id = this.props.match.params.id
    const admin = await isAdmin(this.props.user)
    if (id === '+') {
      this.setState({
        user: { email: '', name: '', admin: false, block: false },
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
        this.setState({ isLoading: true })
        if (!this.state.id) {
          createUser({ ...values, password: '#', password_confirmation: '#' })
            .then(resp => {
              welcome(resp.data.uid).then(() => this.props.history.goBack())
            })
            .catch(() => {
              this.setState({ isLoading: false })
              errorAlert('Erro', 'Erro na criação do usuário', 5)
            })
        } else {
          updateUser(this.state.id, values)
            .then(() => {
              this.props.history.goBack()
            })
            .catch(() => {
              this.setState({ isLoading: false })
              errorAlert('Erro', 'Erro na atualização do usuário', 5)
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

  verifySlug = (rule, value, callback) => {
    if (value && !this.state.id && !value.match(/^[a-z](-?[a-z0-9])*$/)) {
      callback(new Error('Só deve conter letras minúsculas, numeros e travessão (-)'))
    } else {
      callback()
    }
  }

  verifyEmail = (rule, value, callback) => {
    if (value && !validEmail(value)) {
      callback(new Error('E-Mail inválido'))
    } else {
      callback()
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    if (!this.state.loaded) {
      return null
    }
    let actions = []
    if (this.state.admin) {
      actions.push(
        <Button type='primary' onClick={this.validSubmit} loading={this.state.isLoading}>
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
      <Row type='flex' justify='center' align='middle' >
        <Card
          title='Usuário'
          className='card_data'
          style={{ width: '80%', marginTop: '32px' }}
          actions={actions}
        >
          <Form
            onSubmit={this.validSubmit}
            colon={false}
            layout={'vertical'}
          >
            <Row type='flex' justify='space-between' align='middle'>
              <Col span={7}>
                <Form.Item label={'Código'}>
                  {getFieldDecorator('uid', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe código do usuário (letras e números)'
                      },
                      {
                        validator: this.verifySlug
                      }
                    ],
                    initialValue: this.state.user.uid
                  })(<Input placeholder='Código' disabled={!!this.state.id} />)}
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label={'E-Mail'}>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: 'Informe o email do usuário'
                      }
                    ],
                    initialValue: this.state.user.email
                  })(<Input placeholder='E-Mail' disabled={!this.state.admin} />)}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={'Nome'}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o nome do usuário'
                  }
                ],
                initialValue: this.state.user.name
              })(<Input placeholder='Nome' disabled={!this.state.admin} />)}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('admin', {
                valuePropName: 'checked',
                initialValue: this.state.user.admin
              })(
                <Checkbox disabled={!this.state.admin || this.state.id === this.props.user}>
                    Administrador
                </Checkbox>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('block', {
                valuePropName: 'checked',
                initialValue: this.state.user.block
              })(
                <Checkbox disabled={!this.state.admin || this.state.id === this.props.user}>
                    Bloqueado
                </Checkbox>
              )}
            </Form.Item>
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
