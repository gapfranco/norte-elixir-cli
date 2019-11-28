import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Icon, Input, Button, Row, message, Card } from 'antd'
import BasePage from '~/src/components/BasePage'
import { errorAlert } from '~/src/services/utils'

import { changePassword } from '~/src/services/authApi'

class ChangePassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ok: false,
      error: null,
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  }

  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        changePassword(values.current_password, values.new_password)
          .then(() => {
            message.info('Senha foi alterada com sucesso')
            this.props.form.resetFields()
            this.props.history.push('/')
          })
          .catch(() => {
            errorAlert('Usuário', 'Verifique se errou a senha atual', 5)
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
          title='Alterar a senha atual'
          className='card_data'
          style={{ width: 500, marginTop: '32px' }}
        >
          <Form onSubmit={this.validSubmit} colon={false} className='change-form'>
            <Form.Item>
              {getFieldDecorator('current_password', {
                rules: [
                  {
                    required: true,
                    message: 'Informe a senha atual'
                  }
                ]
              })(
                <Input.Password
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Senha atual'
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

            <Row type='flex' justify='center' align='middle'>
              <Button type='primary' htmlType='submit'>
                Confirmar
              </Button>
            </Row>
          </Form>
        </Card>
      </Row>
    )
  }
}

const ChangePasswordForm = Form.create({ name: 'change_password' })(ChangePassword)

class ChangePage extends React.Component {
  render () {
    return <BasePage component={<ChangePasswordForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(ChangePage))
