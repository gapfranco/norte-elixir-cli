import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { Form, Icon, Input, Button, Row, message, Card } from 'antd'
import { passwordConfirm } from '~/src/services/authApi'

class NewPassword extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        passwordConfirm(values.token, values.new_password)
          .then(() => {
            message.info('Senha foi alterada com sucesso')
            this.props.form.resetFields()
            this.props.history.push('/')
          })
          .catch(() => {
            message.error('Erro. Verifique se informou o código correto')
          })
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('new_password')) {
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
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card
          title='Criar nova senha'
          className='card_data'
          style={{ width: 500, marginTop: '32px' }}
        >
          <Form onSubmit={this.validSubmit} colon={false}>
            <Form.Item>
              {getFieldDecorator('token', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o código recebido'
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='number' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Código recebido'
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('new_password', {
                rules: [
                  { required: true, message: 'Informe a nova senha' },
                  {
                    validator: this.verifyPassword
                  }
                ]
              })(
                <Input.Password
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Nova senha'
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('confirm_password', {
                rules: [
                  { required: true, message: 'Repita a nova senha' },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input.Password
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type='password'
                  placeholder='Confirme a senha'
                />
              )}
            </Form.Item>

            <Row type='flex' justify='space-around' align='middle'>
              <Button type='primary' htmlType='submit'>
                Confirmar
              </Button>
              <Button type='default' onClick={() => this.props.history.push('/forgotpassword')}>
                Solicitar novo código
              </Button>
            </Row>
          </Form>
        </Card>
      </Row>
    )
  }
}

const NewPasswordForm = Form.create({ name: 'new_password' })(NewPassword)

class NewPage extends React.Component {
  render () {
    return <NewPasswordForm {...this.props} />
  }
}

const mapStateToProps = () => ({})

export default withRouter(connect(mapStateToProps)(NewPage))
