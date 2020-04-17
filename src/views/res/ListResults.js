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
        scroll={0}
        width={'100%'}
        ro={this.state.ro}
        prompt={'Buscar por Unidade, Item, resultado ou Usuário'}
        table={[
          {
            title: 'Unidade',
            // width: 100,
            // fixed: 'left',
            dataIndex: 'unitKey',
          },
          {
            title: 'Nome Unidade',
            // width: 180,
            // fixed: 'left',
            dataIndex: 'unitName',
          },
          {
            title: 'Item',
            // width: 120,
            // fixed: 'left',
            dataIndex: 'itemKey',
          },
          {
            title: 'Nome item',
            // fixed: 'left',
            // width: 250,
            dataIndex: 'itemName',
          },
          {
            title: 'Resultado',
            // width: 150,
            // fixed: 'left',
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
            // width: 140,
            dataIndex: 'dateDue',
            render: (text) => moment(text).format('DD/MM/YYYY'),
          },
          {
            title: 'Respondido',
            // width: 140,
            dataIndex: 'dateOk',
            render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ''),
          },
          {
            title: 'Usuário',
            dataIndex: 'uid',
          },
          {
            title: 'Responsável',
            dataIndex: 'user.username',
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
