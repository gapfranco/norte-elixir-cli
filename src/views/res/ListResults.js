import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Tag, Icon} from 'antd';
import ListGeneric from '~/src/components/ListGeneric';
import {listAllRatings} from '~/src/services/ratingsApi';
import moment from 'moment';

class ListResults extends React.Component {
  state = {
    ro: true,
    loaded: false,
  };

  async componentDidMount() {
    this.setState({
      loaded: true,
    });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    return (
      <ListGeneric
        title="Resultados dos testes"
        detail="/rating"
        id="id"
        base="ratingsAll"
        list={listAllRatings}
        size={10}
        scroll={2000}
        width={'100%'}
        ro={this.state.ro}
        prompt={'Buscar por Unidade, Item, resultado ou Usuário'}
        table={[
          {
            title: 'Unidade',
            dataIndex: 'unitKey',
          },
          {
            title: 'Nome Unidade',
            dataIndex: 'unitName',
          },
          {
            title: 'Item',
            dataIndex: 'itemKey',
          },
          {
            title: 'Nome item',
            dataIndex: 'itemName',
          },
          {
            title: 'Resultado',
            dataIndex: 'result',
            render: (text) => (
              <span>
                {text === 'conforme' ? (
                  <Tag color={'blue'}>Conforme</Tag>
                ) : text === 'falhou' ? (
                  <Tag color={'red'}>Falhou</Tag>
                ) : (
                  <Icon type="question-circle" />
                )}
              </span>
            ),
          },
          {
            title: 'Data',
            dataIndex: 'dateDue',
            render: (text) => moment(text).format('DD/MM/YYYY'),
          },
          {
            title: 'Respondido',
            dataIndex: 'dateOk',
            render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ''),
          },
          {
            title: 'Usuário',
            dataIndex: 'uid',
          },
          {
            title: 'Nome do usuário',
            dataIndex: 'user.username',
          },
          {
            title: 'Risco',
            width: 120,
            dataIndex: 'riskKey',
          },
          {
            title: 'Nome risco',
            dataIndex: 'riskName',
          },
          {
            title: 'Área',
            width: 120,
            dataIndex: 'areaKey',
          },
          {
            title: 'Nome da Área',
            dataIndex: 'areaName',
          },
          {
            title: 'Processo',
            width: 120,
            dataIndex: 'processKey',
          },
          {
            title: 'Nome Processo',
            dataIndex: 'processName',
          },
        ]}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default withRouter(connect(mapStateToProps)(ListResults));
