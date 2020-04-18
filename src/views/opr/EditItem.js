import React from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Row,
  message,
  Card,
  Popconfirm,
  Icon,
  Tabs,
  Select,
  DatePicker,
} from 'antd';
import BasePage from '~/src/components/BasePage';
import SubListGeneric from '~/src/components/SubListGeneric';

import {
  showItem,
  updateItem,
  createItem,
  deleteItem,
} from '~/src/services/itemsApi';
import {listMappings} from '~/src/services/mappingsApi';
import {listAreas} from '~/src/services/areasApi';
import {listRisks} from '~/src/services/risksApi';
import {listProcesses} from '~/src/services/processesApi';

import {errorAlert} from '~/src/services/utils';

const moment = require('moment');
const dateFormat = 'YYYY-MM-DD';

const frequencies = [
  {key: 'diario', name: 'Diário'},
  {key: 'semanal', name: 'Semanal'},
  {key: 'mensal', name: 'Mensal'},
  {key: 'bimestral', name: 'Bimestral'},
  {key: 'trimestral', name: 'Trimestral'},
  {key: 'semestral', name: 'Semestral'},
  {key: 'anual', name: 'Anual'},
];

class EditItem extends React.Component {
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
          key: '',
          name: '',
          text:
            'Confirme que item está conforme. Se necessário, inclua observações adicionais ou justificativas.',
          freq: null,
          base: null,
          area_key: '',
          risk_key: '',
          process_key: '',
        },
        id: id,
      });
    } else {
      showItem(id)
        .then((res) => {
          this.setState({
            data: {
              key: res.data.data.item.key,
              name: res.data.data.item.name,
              text: res.data.data.item.text,
              base: res.data.data.item.base,
              freq: res.data.data.item.freq,
              area_key: res.data.data.item.area
                ? res.data.data.item.area.key
                : '',
              risk_key: res.data.data.item.risk
                ? res.data.data.item.risk.key
                : '',
              process_key: res.data.data.item.process
                ? res.data.data.item.process.key
                : '',
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
    const res1 = await listAreas(1, 1000);
    const res2 = await listRisks(1, 1000);
    const res3 = await listProcesses(1, 1000);
    this.setState({
      areas: res1.data.data.areas.list,
      risks: res2.data.data.risks.list,
      processes: res3.data.data.processes.list,
      loaded: true,
    });
  };

  validSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({isLoading: true});
        if (this.props.match.params.id === '+') {
          createItem(values)
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
          updateItem(values)
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
    deleteItem(this.state.data.key)
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

  handlePeriod = (value) => {
    this.setState({data: {...this.state.data, freq: value}}, () =>
      console.log(this.state.data),
    );
  };

  handleBase = (value) => {
    this.setState(
      {data: {...this.state.data, base: value.format(dateFormat)}},
      () => console.log(this.state.data),
    );
  };

  setTab = (tab) => {
    this.setState({tab});
  };

  handleArea = (value) => {
    this.setState({data: {...this.state.data, area_key: value}}, () =>
      console.log(this.state.data),
    );
  };

  handleRisk = (value) => {
    this.setState({data: {...this.state.data, risk_key: value}}, () =>
      console.log(this.state.data),
    );
  };

  handleProcess = (value) => {
    this.setState({data: {...this.state.data, process_key: value}}, () =>
      console.log(this.state.data),
    );
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    if (!this.state.loaded) {
      return null;
    }
    let actions = [];
    if (this.state.tab !== '9') {
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
    }

    return (
      <Row type="flex" justify="start" align="middle">
        <Card
          title="Item de conformidade"
          className="card_data"
          style={{width: '100%'}}
          actions={actions}>
          <Form onSubmit={this.validSubmit} colon={false} layout={'vertical'}>
            <Form.Item label={'Código'}>
              {getFieldDecorator('key', {
                rules: [
                  {
                    required: true,
                    message:
                      'Informe código da área (níveis separados por pontos: xxx.xxx.xxxx)',
                  },
                  {
                    validator: this.verifyId,
                  },
                ],
                initialValue: this.state.data.key,
              })(
                <Input
                  placeholder="Código"
                  style={{width: '30%'}}
                  disabled={this.props.match.params.id !== '+'}
                />,
              )}
            </Form.Item>
            <Form.Item label={'Nome'}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o nome do item',
                  },
                ],
                initialValue: this.state.data.name,
              })(<Input placeholder="Nome" style={{width: '50%'}} />)}
            </Form.Item>
            <Form.Item label={'Descrição'}>
              {getFieldDecorator('text', {
                rules: [
                  {
                    required: true,
                    message: 'Informe o texto de descrição',
                  },
                ],
                initialValue: this.state.data.text,
              })(<Input placeholder="Descrição" />)}
            </Form.Item>

            <Tabs defaultActiveKey="1" onChange={this.setTab}>
              <Tabs.TabPane
                tab={
                  <span>
                    <Icon type="block" />
                    Ligações
                  </span>
                }
                key="1">
                <Form.Item label={'Área'}>
                  {getFieldDecorator('area_key', {
                    rules: [
                      {
                        required: false,
                        message: 'Escolha a área relacionada (opcional)',
                      },
                    ],
                    initialValue: this.state.data.area_key,
                  })(
                    <Select onChange={this.handleArea} style={{width: 200}}>
                      <Select.Option value={''}>Nenhuma</Select.Option>
                      {this.state.areas.map((item) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>

                <Form.Item label={'Processo'}>
                  {getFieldDecorator('process_key', {
                    rules: [
                      {
                        required: false,
                        message: 'Escolha um processo relacionado (opcional)',
                      },
                    ],
                    initialValue: this.state.data.process_key,
                  })(
                    <Select onChange={this.handleProcess} style={{width: 200}}>
                      <Select.Option value={''}>Nenhum</Select.Option>
                      {this.state.processes.map((item) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>

                <Form.Item label={'Risco'}>
                  {getFieldDecorator('risk_key', {
                    rules: [
                      {
                        required: false,
                        message: 'Escolha um risco relacionado (opcional)',
                      },
                    ],
                    initialValue: this.state.data.risk_key,
                  })(
                    <Select onChange={this.handleRisk} style={{width: 200}}>
                      <Select.Option value={''}>Nenhum</Select.Option>
                      {this.state.risks.map((item) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Tabs.TabPane>

              <Tabs.TabPane
                tab={
                  <span>
                    <Icon type="calendar" />
                    Programação
                  </span>
                }
                key="2">
                <Form.Item label={'Frequencia'}>
                  {getFieldDecorator('freq', {
                    rules: [
                      {
                        required: false,
                        message: 'Informe a frequencia ou periodicidade',
                      },
                    ],
                    initialValue: this.state.data.freq,
                  })(
                    <Select onChange={this.handlePeriod} style={{width: 160}}>
                      <Select.Option value={''}>Nenhuma</Select.Option>
                      {frequencies.map((item) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item label={'Data base'}>
                  {getFieldDecorator('base', {
                    rules: [
                      {
                        required: false,
                        message: 'Informe a data base',
                      },
                    ],
                    initialValue: this.state.data.base
                      ? moment(this.state.data.base, dateFormat)
                      : null,
                  })(
                    <DatePicker
                      format={'DD/MM/YYYY'}
                      placeholder="Data base"
                      onChange={this.handleBase}
                    />,
                  )}
                </Form.Item>
              </Tabs.TabPane>
              {this.state.id !== '+' && (
                <Tabs.TabPane
                  tab={
                    <span>
                      <Icon type="share-alt" />
                      Distribuição
                    </span>
                  }
                  key="9">
                  <SubListGeneric
                    list={listMappings}
                    size={5}
                    id={this.state.id}
                    subkey="id"
                    search={false}
                    title={'Unidades e responsáveis'}
                    detail={`mapping/${this.state.id}`}
                    base="mappings"
                    table={[
                      {
                        title: 'Unidade',
                        dataIndex: 'unit.name',
                      },
                      {
                        title: 'Responsável',
                        dataIndex: 'user.uid',
                      },
                      {
                        title: 'Nome',
                        dataIndex: 'user.username',
                      },
                      {
                        title: 'Avisar',
                        dataIndex: 'alert_user.username',
                      },
                    ]}
                  />
                </Tabs.TabPane>
              )}
            </Tabs>
          </Form>
        </Card>
      </Row>
    );
  }
}

const EditItemForm = Form.create({name: 'edit_item'})(EditItem);

class EditItemPage extends React.Component {
  render() {
    return <BasePage component={<EditItemForm {...this.props} />} />;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(EditItemPage));
