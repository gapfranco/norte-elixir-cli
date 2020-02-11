import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Row, message, Card, Popconfirm } from 'antd'
import BasePage from '~/src/components/BasePage'

import { showRisk, updateRisk, createRisk, deleteRisk } from '~/src/services/risksApi'
import { errorAlert } from '~/src/services/utils'

class EditRisk extends React.Component {
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
    if (id === '+') {
      this.setState({
        data: { key: '', name: '' },
        loaded: true,
        id: id
      })
    } else {
      showRisk(id)
        .then(res => {
          this.setState({
            data: res.data.data.risk,
            loaded: true,
            id
          })
        })
        .catch(() => {
          message.error('Erro na leitura do registro')
          this.setState({ loaded: true })
        })
    }
  }

  validSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ isLoading: true })
        if (this.props.match.params.id === '+') {
          createRisk(values)
            .then(() => {
              this.setState({ isLoading: false })
              this.props.history.goBack()
            })
            .catch((err) => {
              this.setState({ isLoading: false })
              errorAlert('Erro', `Erro na criação. Verifique o formato do código (${err})`, 5)
            })
        } else {
          updateRisk(values)
            .then(() => {
              this.setState({ isLoading: false })
              this.props.history.goBack()
            })
            .catch((err) => {
              this.setState({ isLoading: false })
              errorAlert('Erro', `Erro de gravação (${err})`, 5)
            })
        }
      }
    })
  }

  submitDelete = () => {
    deleteRisk(this.state.data.key)
      .then(() => {
        message.error('Registro excluido')
        this.props.history.goBack()
      })
      .catch(() => {
        message.error('Erro na exclusão do registro')
      })
  }

  verifyId = (rule, value, callback) => {
    if (value && !this.state.id && !value.match(/^[a-z0-9](\.?[a-z0-9])*$/)) {
      callback(new Error('Só deve conter letras minúsculas, numeros e pontos (.)'))
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
    actions.push(
      <Button type='primary' onClick={this.validSubmit} loading={this.state.isLoading}>
        Gravar
      </Button>
    )
    if (this.state.id !== '+') {
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
    actions.push(<Button onClick={() => this.props.history.goBack()}>Voltar</Button>)

    return (
      <Row type='flex' justify='start' align='middle' >
        <Card
          title='Risco'
          className='card_data'
          style={{ width: '80%', marginTop: '32px' }}
          actions={actions}
        >
          <Form
            onSubmit={this.validSubmit}
            colon={false}
            layout={'vertical'}
          >
            <Form.Item label={'Código'}>
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message: 'Informe código do risco (níveis separados por pontos: xxx.xxx.xxxx)'
                  },
                  {
                    validator: this.verifyId
                  }
                ],
                initialValue: this.state.data.key
              })(<Input placeholder='Código' style={{ width: '50%' }} disabled={this.props.match.params.id !== '+'} />)}
            </Form.Item>
            <Form.Item label={'Nome'}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o nome do risco'
                  }
                ],
                initialValue: this.state.data.name
              })(<Input placeholder='Nome' />)}
            </Form.Item>

          </Form>
        </Card>
      </Row>
    )
  }
}

const EditRiskForm = Form.create({ name: 'edit_risk' })(EditRisk)

class EditRiskPage extends React.Component {
  render () {
    return <BasePage component={<EditRiskForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(EditRiskPage))
