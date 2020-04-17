import React from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Row, message, Card, Divider, Typography} from 'antd';
import BasePage from '~/src/components/BasePage';

import {showEvent} from '~/src/services/eventsApi';

const {Title} = Typography;

class ViewEvent extends React.Component {
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
    showEvent(id)
      .then((res) => {
        this.setState({
          data: res.data.data.event,
          loaded: true,
        });
      })
      .catch(() => {
        message.error('Erro na leitura do registro');
        this.setState({loaded: true});
      });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    let actions = [];
    actions.push(
      <Button onClick={() => this.props.history.goBack()}>Voltar</Button>,
    );
    return (
      <Row type="flex" justify="start" align="middle">
        <Card
          title="Apontamento/Ocorrência"
          className="card_data"
          style={{width: '100%'}}
          actions={actions}>
          <Title level={4}>
            {this.state.data.itemKey} - {this.state.data.itemName}
          </Title>
          <p>{this.state.data.eventDate}</p>

          <p>
            <strong>Descrição</strong>
          </p>
          {this.state.data.text.split('\n', 3).map((lin) => (
            <div key={lin}>{lin}</div>
          ))}

          <Divider />
          <p>
            <strong>Usuário responsável</strong>
          </p>
          <p>
            {this.state.data.uid} - {this.state.data.user.username}
          </p>
          <p>
            <strong>Unidade</strong>
          </p>
          <p>
            {this.state.data.unitKey} - {this.state.data.unitName}
          </p>

          <p>
            <strong>Risco associado</strong>
          </p>
          <p>
            {this.state.data.riskKey} - {this.state.data.riskName}
          </p>

          <p>
            <strong>Área associada</strong>
          </p>
          <p>
            {this.state.data.areaKey} - {this.state.data.areaName}
          </p>

          <p>
            <strong>Processo associado</strong>
          </p>
          <p>
            {this.state.data.processKey} - {this.state.data.processName}
          </p>
        </Card>
      </Row>
    );
  }
}

class ViewEventPage extends React.Component {
  render() {
    return <BasePage component={<ViewEvent {...this.props} />} />;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(ViewEventPage));
