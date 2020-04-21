import React from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Row, Card, Form, Input, Select, DatePicker} from 'antd';
import BasePage from '~/src/components/BasePage';
import NewWindow from 'react-new-window';
import {omit} from 'lodash';

import {reportRatings} from '~/src/services/ratingsApi';
import {listAreas} from '~/src/services/areasApi';
import {listRisks} from '~/src/services/risksApi';
import {listProcesses} from '~/src/services/processesApi';

class ReportResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      filter: {},
    };
  }

  componentDidMount() {
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
    reportRatings(this.state.filter).then((resp) => {
      console.log(resp);
      this.setState({
        data: resp.data.data.ratingsReport,
        show: !this.state.show,
      });
    });
  };

  handleBase = (campo, text) => {
    if (text) {
      let field = text;
      if (campo === 'date_ini' || campo === 'date_end') {
        field = text.format('YYYY-MM-DD');
      }
      this.setState({filter: {...this.state.filter, [campo]: field}});
    } else {
      this.setState({filter: omit(this.state.filter, campo)});
    }
  };

  render() {
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
        Processar
      </Button>,
    );
    actions.push(
      <Button onClick={() => this.props.history.goBack()}>Voltar</Button>,
    );
    return (
      <>
        <Row type="flex" justify="start" align="middle">
          <Card
            title="Relatório de Conformidade"
            className="card_data"
            style={{width: '80%'}}
            actions={actions}>
            <Form colon={false} layout={'vertical'}>
              <Form.Item label={'Data inicial'}>
                <DatePicker
                  format={'DD/MM/YYYY'}
                  placeholder="Data inicial"
                  onChange={(text) => this.handleBase('date_ini', text)}
                />
              </Form.Item>
              <Form.Item label={'Data final'}>
                <DatePicker
                  format={'DD/MM/YYYY'}
                  placeholder="Data final"
                  onChange={(text) => this.handleBase('date_end', text)}
                />
              </Form.Item>
              <Form.Item label={'Área'}>
                <Select
                  onChange={(text) => this.handleBase('area', text)}
                  style={{width: 200}}>
                  <Select.Option value={''}>Todas</Select.Option>
                  {this.state.areas.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={'Risco'}>
                <Select
                  onChange={(text) => this.handleBase('risk', text)}
                  style={{width: 200}}>
                  <Select.Option value={''}>Todos</Select.Option>
                  {this.state.risks.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={'Processo'}>
                <Select
                  onChange={(text) => this.handleBase('process', text)}
                  style={{width: 200}}>
                  <Select.Option value={''}>Todos</Select.Option>
                  {this.state.processes.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </Row>
        {this.state.show && this.state.data && (
          <NewWindow
            title="Relatório"
            features={{width: 1500, height: 900}}
            onUnload={() => this.setState({show: false})}>
            {report(this.state.data)}
          </NewWindow>
        )}
      </>
    );
  }
}

const report = (data) => (
  <table cellPadding="6px" border="1px">
    <thead>
      <tr style={{backgroundColor: '#ccc'}}>
        <th>ITEM</th>
        <th>NOME</th>
        <th>UNIDADE</th>
        <th>RESPONSÁVEL</th>
        <th>DATA</th>
        <th>RESPOSTA</th>
        <th>RESULTADO</th>
        <th>NOTAS</th>
        <th>RISCO</th>
        <th>AREA</th>
        <th>PROCESSO</th>
      </tr>
    </thead>
    <tbody>
      {data.map((lin) => (
        <tr key={lin.id}>
          <td>{lin.itemKey}</td>
          <td>{lin.itemName}</td>
          <td>{lin.unitName}</td>
          <td>{lin.uid}</td>
          <td>{lin.dateDue}</td>
          <td>{lin.dateOk}</td>
          <td>{lin.result}</td>
          <td>{lin.notes}</td>
          <td>{lin.riskName}</td>
          <td>{lin.areaName}</td>
          <td>{lin.processName}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

class ReportResultPage extends React.Component {
  render() {
    return <BasePage component={<ReportResult {...this.props} />} />;
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

export default withRouter(connect(mapStateToProps)(ReportResultPage));
