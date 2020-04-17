import React from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Form, Button, Row, message, Card, Popconfirm, Select} from 'antd';
import BasePage from '~/src/components/BasePage';

import {
  showMapping,
  createMapping,
  updateMapping,
  deleteMapping,
} from '~/src/services/mappingsApi';
import {listUnits} from '~/src/services/unitsApi';
import {listUser} from '~/src/services/userApi';
import {errorAlert} from '~/src/services/utils';

class EditMapping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isLoading: false,
      user: null,
      open: false,
      tab: '1',
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id === '+') {
      this.setState({
        data: {
          item_key: this.props.match.params.key,
          unit_key: null,
          user_key: null,
          alert_user_key: null,
        },
        id: id,
      });
    } else {
      showMapping(id)
        .then((res) => {
          this.setState({
            data: {
              item_key: this.props.match.params.key,
              unit_key: res.data.data.mapping.unit.key,
              user_key: res.data.data.mapping.user.uid,
              alert_user_key: res.data.data.mapping.alert_user
                ? res.data.data.mapping.alert_user.uid
                : null,
            },
            id,
          });
        })
        .catch(() => {
          message.error('Erro na leitura do registro');
          this.setState({loaded: true});
        });
    }
    this.getOptions();
  }

  getOptions = async () => {
    const res1 = await listUnits(1, 1000);
    const res2 = await listUser(1, 1000);
    this.setState({
      units: res1.data.data.units.list,
      users: res2.data.data.users.list,
      loaded: true,
    });
  };

  validSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({isLoading: true});
        if (this.props.match.params.id === '+') {
          createMapping({...values, item_key: this.props.match.params.key})
            .then(() => {
              this.setState({isLoading: false});
              this.props.history.goBack();
            })
            .catch((err) => {
              this.setState({isLoading: false});
              errorAlert(
                'Erro',
                `Erro na criação. Verifique o formato do código (${err})`,
                5,
              );
            });
        } else {
          updateMapping({...values, item_key: this.props.match.params.key})
            .then(() => {
              this.setState({isLoading: false});
              this.props.history.goBack();
            })
            .catch((err) => {
              this.setState({isLoading: false});
              errorAlert('Erro', `Erro de gravação (${err})`, 5);
            });
        }
      }
    });
  };

  submitDelete = () => {
    deleteMapping(this.state.data)
      .then(() => {
        message.error('Registro excluido');
        this.props.history.goBack();
      })
      .catch(() => {
        message.error('Erro na exclusão do registro');
      });
  };

  verifyId = (rule, value, callback) => {
    if (
      value &&
      this.props.match.params.id === '+' &&
      !value.match(/^[a-zA-Z0-9](\.?[a-zA-Z0-9])*$/)
    ) {
      callback(new Error('Só deve conter letras, numeros e pontos (.)'));
    } else {
      callback();
    }
  };

  handleUnit = (value) => {
    this.setState({data: {...this.state.data, unit_key: value}}, () =>
      console.log(this.state.data),
    );
  };

  handleUser = (value) => {
    this.setState({data: {...this.state.data, user_key: value}}, () =>
      console.log(this.state.data),
    );
  };

  handleAlertUser = (value) => {
    this.setState({data: {...this.state.data, alert_user_key: value}}, () =>
      console.log(this.state.data),
    );
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    if (!this.state.loaded) {
      return null;
    }
    console.log(this.state);
    let actions = [];
    actions.push(
      <Button
        type="primary"
        onClick={this.validSubmit}
        loading={this.state.isLoading}>
        Gravar
      </Button>,
    );
    if (this.state.id !== '+') {
      actions.push(
        <Popconfirm
          placement="top"
          title={'Confirme a exclusão'}
          onConfirm={this.submitDelete}
          okText="Sim"
          cancelText="Não">
          <Button type="danger">Excluir</Button>
        </Popconfirm>,
      );
    }
    actions.push(
      <Button onClick={() => this.props.history.goBack()}>Voltar</Button>,
    );

    return (
      <Row type="flex" justify="start" align="middle">
        <Card
          title="Distribuição dos testes de conformidade"
          className="card_data"
          style={{width: '100%'}}
          actions={actions}>
          <Form onSubmit={this.validSubmit} colon={false} layout={'vertical'}>
            <Form.Item label={'Unidade'}>
              {getFieldDecorator('unit_key', {
                rules: [
                  {
                    required: true,
                    message: 'Escolha a unidade',
                  },
                ],
                initialValue: this.state.data.unit_key,
              })(
                <Select onChange={this.handleUnit} style={{width: 200}}>
                  {this.state.units.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label={'Responsável'}>
              {getFieldDecorator('user_key', {
                rules: [
                  {
                    required: true,
                    message: 'Escolha o usuário responsável',
                  },
                ],
                initialValue: this.state.data.user_key,
              })(
                <Select onChange={this.handleUser} style={{width: 200}}>
                  {this.state.users.map((item) => (
                    <Select.Option key={item.uid} value={item.uid}>
                      {item.username}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>

            <Form.Item label={'Avisar em caso de falha'}>
              {getFieldDecorator('alert_user_key', {
                initialValue: this.state.data.alert_user_key,
              })(
                <Select onChange={this.handleAlertUser} style={{width: 200}}>
                  <Select.Option value={null}>Ninguém</Select.Option>
                  {this.state.users.map((item) => (
                    <Select.Option key={item.uid} value={item.uid}>
                      {item.username}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Form>
        </Card>
      </Row>
    );
  }
}

const EditMappingForm = Form.create({name: 'edit_mapping'})(EditMapping);

class EditMappingPage extends React.Component {
  render() {
    return <BasePage component={<EditMappingForm {...this.props} />} />;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(EditMappingPage));
