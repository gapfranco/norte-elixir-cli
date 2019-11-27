import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

import { signIn, signOut } from '~/src/services/authApi'
import { findUser } from '~/src/services/userApi'

import { Form, Icon, Input, Button, Row, message, Card } from 'antd'

import { bindActionCreators } from 'redux'
import { Creators as userActions } from '~/src/redux/ducks/user'
import { Creators as pageActions } from '~/src/redux/ducks/page'
import { Creators as orderActions } from '~/src/redux/ducks/order'
import { Creators as queryActions } from '~/src/redux/ducks/query'

class SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: null,
      isLoading: false
    }
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    this.setState({ codigo: values.uid })
  }

  closeError = () => {
    this.setState({ error: null })
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value })
  }

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
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values)
        this.setState({ isLoading: true })
        try {
          await signIn(values.uid, values.password)
          const user = await findUser(values.uid)
          if (user.data.block) {
            signOut()
            message.error('Usuário bloqueado. Consulte administrador do sistema')
            this.setState({
              isLoading: false
            })
            return
          }
          this.setState({ isLoading: false })
          // reset redux page states
          this.props.userActions.setSessionRequest()
          this.props.pageActions.setPage(null)
          this.props.orderActions.setOrder(null)
          this.props.queryActions.setQuery(null)
          this.props.history.push('/')
        } catch {
          message.error('Erro de conexão. Verifique usuário e/ou senha')
          this.setState({
            isLoading: false
          })
        }
      }
    })
  }

  forgotPassword = () => {
    this.props.history.push('/forgotpassword')
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Row type='flex' justify='center' align='middle'>
        <Card
          title='Norte - Risco e Compliance'
          className='card_login'
          style={{ width: 600, marginTop: '32px' }}
          cover={<img alt='norte' src='/images/norte.jpg' />}
        >
          <Card.Meta title='Conexão' description='Identifique-se para acessar' />
          <p />
          <Form onSubmit={this.validSubmit} className='login-form'>
            <Form.Item>
              {getFieldDecorator('uid', {
                rules: [
                  {
                    required: true,
                    message: 'Informe seu codigo de identificação'
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Código do usuário'
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Informe sua senha' }]
              })(
                <Input
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type='password'
                  placeholder='sENHA'
                />
              )}
            </Form.Item>
            <Row type='flex' justify='space-between' align='middle'>
              <Button type='primary' htmlType='submit' loading={this.state.isLoading}>
                Conectar
              </Button>
              <Button onClick={() => this.props.history.push('/signup')}>Criar nova conta</Button>
              <Button onClick={() => this.props.history.push('/forgotpassword')} type='link'>
                Esqueci a senha
              </Button>
            </Row>
          </Form>
        </Card>
      </Row>
    )
  }
}

const mapStateToProps = () => ({})

// const mapDispatchToProps = dispatch => bindActionCreators(authActions, dispatch)

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    pageActions: bindActionCreators(pageActions, dispatch),
    orderActions: bindActionCreators(orderActions, dispatch),
    queryActions: bindActionCreators(queryActions, dispatch)
  }
}

const SignInForm = Form.create({ name: 'normal_login' })(SignIn)

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignInForm)
)
