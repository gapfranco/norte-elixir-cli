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
  Select,
  Divider,
  Typography,
} from 'antd';
import BasePage from '~/src/components/BasePage';

import {showRating, updateRating} from '~/src/services/ratingsApi';
import {createEvent} from '~/src/services/eventsApi';
import {errorAlert} from '~/src/services/utils';

const {Title} = Typography;

class EditRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isLoading: false,
      user: null,
      open: false,
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    showRating(id)
      .then((res) => {
        this.setState({
          data: res.data.data.rating,
          results: [
            {key: 'conforme', name: 'Conforme'},
            {key: 'falhou', name: 'Falhou'},
          ],
          loaded: true,
        });
      })
      .catch(() => {
        message.error('Erro na leitura do registro');
        this.setState({loaded: true});
      });
  }

  validSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({isLoading: true});
        updateRating({...values, id: this.state.data.id})
          .then(() => {
            if (values.result === 'falhou') {
              createEvent(this.state.data.id).then(() => {
                this.setState({isLoading: false});
                this.props.history.goBack();
              });
            } else {
              this.setState({isLoading: false});
              this.props.history.goBack();
            }
          })
          .catch((err) => {
            this.setState({isLoading: false});
            errorAlert('Erro', `Erro de gravação (${err})`, 5);
          });
      }
    });
  };

  handleResult = (value) => {
    this.setState(
      {
        data: {
          ...this.state.data,
          result: value,
        },
      },
      () => console.log(this.state.data),
    );
  };

  verifyResult = (rule, value, callback) => {
    if (!value && this.state.data.result === 'falhou') {
      callback(new Error('Teste com falha deve incluir texto de observações'));
    } else {
      callback();
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    if (!this.state.loaded) {
      return null;
    }
    let actions = [];
    if (!this.state.data.dateOk) {
      actions.push(
        <Button
          type="primary"
          onClick={this.validSubmit}
          loading={this.state.isLoading}>
          Gravar
        </Button>,
      );
    }
    actions.push(
      <Button onClick={() => this.props.history.goBack()}>Voltar</Button>,
    );

    return (
      <Row type="flex" justify="start" align="middle">
        <Card
          title="Teste de conformidade"
          className="card_data"
          style={{width: '100%'}}
          actions={actions}>
          <Form onSubmit={this.validSubmit} colon={false} layout={'vertical'}>
            <Title level={4}>
              {this.state.data.itemKey} - {this.state.data.itemName}
            </Title>
            {this.state.data.itemText.split('\n', 3).map((lin) => (
              <div key={lin}>{lin}</div>
            ))}
            <Divider />

            <Form.Item label={'Resposta'}>
              {getFieldDecorator('result', {
                rules: [
                  {
                    required: true,
                    message: 'Indique o resultado',
                  },
                ],
                initialValue: this.state.data.result,
              })(
                <Select
                  onChange={this.handleResult}
                  style={{
                    width: 200,
                    color: '#000',
                  }}
                  disabled={this.state.data.dateOk !== null}>
                  <Select.Option value={''}>-----</Select.Option>
                  {this.state.results.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label={'Observações'}>
              {getFieldDecorator('notes', {
                rules: [
                  {
                    required: false,
                    message: 'Observações sobre o resultado do teste',
                  },
                  {
                    validator: this.verifyResult,
                  },
                ],
                initialValue: this.state.data.notes,
              })(
                <Input.TextArea
                  placeholder="Notas sobre a resposta"
                  disabled={this.state.data.dateOk}
                  rows={6}
                  style={{color: '#000'}}
                />,
              )}
            </Form.Item>
          </Form>
        </Card>
      </Row>
    );
  }
}

const EditRatingForm = Form.create({name: 'edit_rating'})(EditRating);

class EditRatingPage extends React.Component {
  render() {
    return <BasePage component={<EditRatingForm {...this.props} />} />;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(EditRatingPage));
