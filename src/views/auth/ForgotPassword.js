import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Icon, Input, Button, Row, message, Card, Alert } from 'antd'

import { resetPassword } from '~/src/services/authApi'
import { errorAlert } from '~/src/services/utils'

class ForgotPassword extends React.Component {
  state = { isLoading: false }

  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          isLoading: true
        })
        resetPassword(values.uid)
          .then(() => {
            message.info('Solicitação de código enviada')
            this.props.form.resetFields()
            this.props.history.push('/newpassword')
          })
          .catch(() => {
            errorAlert('Erro de conexão', 'Verifique se o código está correto', 5)
            this.setState({
              isLoading: false
            })
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
              'Entre com seu código de usuário e clique em "Solicitar". Vai receber um código ',
              'por e-mail. Na próxima tela, entre com este código e altere a senha. ',
              'Se já tiver recebido o código, clique diretamente em "Criar senha"'
            ]}
            type='info'
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
              <Button type='primary' htmlType='submit' loading={this.state.isLoading}>
                Solicitar
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
