import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { Form, Icon, Input, Button, Row, Col, message, Card, Alert } from 'antd'
import { clientExists } from '~/src/services/clientApi'
import { signUpUser } from '~/src/services/authApi'
import { validEmail } from '~/src/services/validators'

class SignUp extends React.Component {
  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        signUpUser(values.codigo, values.empresa, values.usr, values.email, values.name, values.password)
          .then(() => {
            this.props.form.resetFields()
            this.props.history.push(`/signin?uid=${values.usr}@${values.codigo}`)
          })
          .catch(err => {
            message.error('Erro. Verifique se informou o código correto ' + err.message)
          })
      }
    })
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

  verifySlug = (rule, value, callback) => {
    if (value && !value.match(/^[a-z](-?[a-z0-9])*$/)) {
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

  verifyClient = async (rule, value, callback) => {
    let ex = false
    if (value) {
      ex = await clientExists(value)
    }
    if (ex) {
      callback(new Error('Já existe cliente com este código'))
    } else {
      callback()
    }
  }

  // verifyUser = async (rule, value, callback) => {
  //   let ex = false
  //   if (value) {
  //     ex = await userExists(value)
  //   }
  //   if (ex) {
  //     callback(new Error(`Já existe usuário com e-mail ${value}`))
  //   } else {
  //     callback()
  //   }
  // }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card
          title='Criar nova conta'
          className='card_data'
          style={{ width: 880, marginTop: '32px' }}
        >
          <Alert
            message='Criar nova empresa e conta'
            description={[
              'Cria uma nova empresa e usuário. ',
              'Usar códigos com letras e números para a empresa e usuário. ',
              'Seu usuário é identificado por usuario@empresa.'
            ]}
            type='info'
            showIcon
          />
          <p />
          <Form onSubmit={this.validSubmit} colon={false} layout={'vertical'}>

            <Form.Item label='Código da empresa' >
              {getFieldDecorator('codigo', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o codigo do cliente'
                  },
                  {
                    validator: this.verifyClient
                  },
                  {
                    validator: this.verifySlug
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='number' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Código da empresa' style={{ width: '30%' }}
                />
              )}
            </Form.Item>

            <Form.Item label='Nome da empresa'>
              {getFieldDecorator('empresa', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o nome da empresa responsável'
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='check' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Nome da empresa'
                />
              )}
            </Form.Item>

            <Form.Item label='Código do usuário' >
              {getFieldDecorator('usr', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o codigo do usuário'
                  },
                  {
                    validator: this.verifySlug
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='number' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Código da usuário' style={{ width: '30%' }}
                />
              )}
            </Form.Item>

            <Form.Item label='E-Mail'>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: 'Informe seu e-mail'
                  },
                  {
                    validator: this.verifyEmail
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='E-Mail do usuário'
                />
              )}
            </Form.Item>
            <Form.Item label='Nome do usuário'>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Informe seu nome'
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='check' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Nome do usuário'
                />
              )}
            </Form.Item>

            <Row type='flex' justify='space-between' align='middle'>
              <Col span={11}>
                <Form.Item label='Senha'>
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
                      placeholder='Sua senha'
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='Repetir a senha'>
                  {getFieldDecorator('confirm_password', {
                    rules: [
                      { required: true, message: 'Repita a senha' },
                      {
                        validator: this.compareToFirstPassword
                      }
                    ]
                  })(
                    <Input.Password
                      prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type='password'
                      placeholder='Confirmar a senha'
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row type='flex' justify='space-between' align='middle'>
              <Button type='primary' htmlType='submit'>
                Confirmar
              </Button>
              <Button type='default' onClick={() => this.props.history.push('/signin')}>
                Voltar
              </Button>
            </Row>
          </Form>
        </Card>
      </Row>
    )
  }
}

const SignUpForm = Form.create({ name: 'new_password' })(SignUp)

class NewPage extends React.Component {
  render () {
    return <SignUpForm {...this.props} />
  }
}

const mapStateToProps = () => ({})

export default withRouter(connect(mapStateToProps)(NewPage))
