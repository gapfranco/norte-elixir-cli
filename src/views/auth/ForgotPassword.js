import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Icon, Input, Button, Row, message, Card } from 'antd'

import { passwordReset } from '~/src/services/authApi'

class ForgotPassword extends React.Component {
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
        passwordReset(values.uid)
          .then(() => {
            message.info('Solicitação de código enviada')
            this.props.form.resetFields()
            this.props.history.push('/newpassword')
          })
          .catch(() => {
            message.error('Verifique se o email é válido e a conexão')
          })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card
          title='Solicitar código para criar senha'
          className='card_data'
          style={{ width: 500, marginTop: '32px' }}
        >
          <Alert
            message='Solicitar nova senha'
            description={[
              'Entre com se código de usuário e clique em "Solicitar código" para receber um token ou código ',
              'no seu e-mail. Na próxima tela, entre com o código recebido e altere sua senha. ',
              'Se já tiver recebido o código, clique diretamente em "Criar senha"'
            ]}
            type='info'
            showIcon
          />
          <p />
          <Form onSubmit={this.validSubmit} colon={false}>
            <Form.Item>
              {getFieldDecorator('uid', {
                rules: [
                  {
                    required: true,
                    message: 'Informe seu código de usuário'
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='number' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Código do usuário'
                />
              )}
            </Form.Item>

            <Row type='flex' justify='space-around' align='middle'>
              <Button type='primary' htmlType='submit'>
                Solicitar código
              </Button>
              <Button type='default' onClick={() => this.props.history.push('/newpassword')}>
                Criar senha
              </Button>
              <Button type='default' onClick={() => this.props.history.push('/signin')}>
                Conectar
              </Button>
            </Row>
          </Form>
        </Card>
      </Row>
    )
  }
}

const ForgotPasswordForm = Form.create({ name: 'new_password' })(ForgotPassword)

class ForgotPage extends React.Component {
  render () {
    return <ForgotPasswordForm {...this.props} />
  }
}

const mapStateToProps = () => ({})

export default withRouter(connect(mapStateToProps)(ForgotPage))
