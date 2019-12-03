import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Row, message, Card, Popconfirm } from 'antd'
import BasePage from '~/src/components/BasePage'

import { showUnit, updateUnit, createUnit, deleteUnit } from '~/src/services/unitsApi'
import { errorAlert } from '~/src/services/utils'

class EditUnit extends React.Component {
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
        data: { id: '', name: '' },
        loaded: true,
        id: 0
      })
    } else {
      showUnit(id)
        .then(res => {
          this.setState({
            data: res.data,
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
        if (!this.state.id) {
          createUnit(values)
            .then(() => {
              this.setState({ isLoading: false })
              this.props.history.goBack()
            })
            .catch(() => {
              this.setState({ isLoading: false })
              errorAlert('Erro', 'Erro na criação do usuário. Verifique se código de nível superior existe.', 5)
            })
        } else {
          updateUnit(this.state.id, values)
            .then(() => {
              this.setState({ isLoading: false })
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
    deleteUnit(this.state.data.id)
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
    actions.push(<Button onClick={() => this.props.history.goBack()}>Voltar</Button>)

    return (
      <Row type='flex' justify='center' align='middle' >
        <Card
          title='Unidades'
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
              {getFieldDecorator('id', {
                rules: [
                  {
                    required: true,
                    message: 'Informe código da unidade (níveis separados por pontos: xxx.xxx.xxxx)'
                  },
                  {
                    validator: this.verifyId
                  }
                ],
                initialValue: this.state.data.id
              })(<Input placeholder='Código' style={{ width: '50%' }}disabled={!!this.state.id} />)}
            </Form.Item>
            <Form.Item label={'Nome'}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o nome do unidade'
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

const EditUnitForm = Form.create({ name: 'edit_unit' })(EditUnit)

class EditUnitPage extends React.Component {
  render () {
    return <BasePage component={<EditUnitForm {...this.props} />} />
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

export default withRouter(connect(mapStateToProps)(EditUnitPage))
