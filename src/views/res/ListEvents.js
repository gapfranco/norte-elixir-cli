import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import ListGeneric from '~/src/components/ListGeneric';
import {listAllEvents} from '~/src/services/eventsApi';
import moment from 'moment';

class ListEvents extends React.Component {
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
        title="Apontamentos/Ocorrências"
        detail="/event"
        id="id"
        base="eventsAll"
        list={listAllEvents}
        size={10}
        scroll={2000}
        width={'100%'}
        ro={this.state.ro}
        prompt={'Buscar por Unidade ou Usuário'}
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
            title: 'Data',
            dataIndex: 'eventDate',
            render: (text) => moment(text).format('DD/MM/YYYY'),
          },
          {
            title: 'Usuário',
            dataIndex: 'uid',
          },
          {
            title: 'Nome usuário',
            dataIndex: 'user.username',
          },
          {
            title: 'Risco',
            dataIndex: 'riskName',
          },
          {
            title: 'Área',
            dataIndex: 'areaName',
          },
          {
            title: 'Processo',
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

export default withRouter(connect(mapStateToProps)(ListEvents));
