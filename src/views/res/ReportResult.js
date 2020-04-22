import React from 'react';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Row, Card, Form, Select, DatePicker} from 'antd';
import BasePage from '~/src/components/BasePage';
import NewWindow from 'react-new-window';
import {omit} from 'lodash';

import {reportRatings} from '~/src/services/ratingsApi';
import {listAreas} from '~/src/services/areasApi';
import {listRisks} from '~/src/services/risksApi';
import {listProcesses} from '~/src/services/processesApi';
import {listItems} from '~/src/services/itemsApi';
import {listUnits} from '~/src/services/unitsApi';

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
    const res4 = await listItems(1, 1000);
    const res5 = await listUnits(1, 1000);
    this.setState({
      areas: res1.data.data.areas.list,
      risks: res2.data.data.risks.list,
      processes: res3.data.data.processes.list,
      items: res4.data.data.items.list,
      units: res5.data.data.units.list,
      loaded: true,
    });
  };

  validSubmit = (e) => {
    e.preventDefault();
    reportRatings(this.state.filter).then((resp) => {
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
    // console.log(this.state);
    let actions = [];
    actions.push(
      <Button
        type="primary"
        onClick={this.validSubmit}
        loading={this.state.isLoading}>
        Processar
      </Button>,
    );
    // actions.push(
    //   <Button onClick={() => this.props.history.goBack()}>Voltar</Button>,
    // );
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
              <Form.Item label={'Item'}>
                <Select
                  onChange={(text) => this.handleBase('item', text)}
                  style={{width: 200}}>
                  <Select.Option value={''}>&nbsp;</Select.Option>
                  {this.state.items.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={'Unidade'}>
                <Select
                  onChange={(text) => this.handleBase('unit', text)}
                  style={{width: 200}}>
                  <Select.Option value={''}>&nbsp;</Select.Option>
                  {this.state.units.map((unit) => (
                    <Select.Option key={unit.key} value={unit.key}>
                      {unit.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={'Área'}>
                <Select
                  onChange={(text) => this.handleBase('area', text)}
                  style={{width: 200}}>
                  <Select.Option value={''}>&nbsp;</Select.Option>
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
                  <Select.Option value={''}>&nbsp;</Select.Option>
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
                  <Select.Option value={''}>&nbsp;</Select.Option>
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
            title="Relatório de conformidade"
            features={{width: 1500, height: 900}}
            onUnload={() => this.setState({show: false})}>
            {report(this.state.data)}
          </NewWindow>
        )}
      </>
    );
  }
}

const monta = (data) => {
  let parte = [];
  let ant = '';

  for (const lin of data) {
    if (lin.itemKey !== ant) {
      parte.push([lin.itemKey, lin.itemName, [lin]]);
      ant = lin.itemKey;
    } else {
      parte[parte.length - 1][2].push(lin);
    }
  }
  console.log(parte);
  return parte;
};

const report = (data) => {
  const lins = monta(data);
  return (
    <>
      {lins.map((lin) => (
        <table
          key={lin[0]}
          cellPadding="4px"
          border="1px"
          style={{margin: '8px'}}>
          <thead>
            <tr style={{backgroundColor: '#ccc'}}>
              <th colSpan={9}>{lin[0]}</th>
            </tr>
            <tr>
              <th colSpan={9}>{lin[1]}</th>
            </tr>
            <tr style={{backgroundColor: '#ccc'}}>
              <th>Unidade</th>
              <th>Responsável</th>
              <th>Data</th>
              <th>Resposta</th>
              <th>Resultado</th>
              <th>Notas</th>
              <th>Risco</th>
              <th>Area</th>
              <th>Processo</th>
            </tr>
          </thead>
          <tbody>
            {lin[2].map((lin) => (
              <tr key={lin.id}>
                <td>{lin.unitName}</td>
                <td>{lin.uid}</td>
                <td>{lin.dateDue}</td>
                <td>{lin.dateOk}</td>
                <td>{lin.result}</td>
                <td width="20%">{lin.notes}</td>
                <td>{lin.riskName}</td>
                <td>{lin.areaName}</td>
                <td>{lin.processName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </>
  );
};

// return (
//   <table cellPadding="4px" border="1px">
//     <thead>
//       <tr style={{backgroundColor: '#ccc'}}>
//         <th>ITEM</th>
//         <th>UNIDADE</th>
//         <th>RESPONSÁVEL</th>
//         <th>DATA</th>
//         <th>RESPOSTA</th>
//         <th>RESULTADO</th>
//         <th>NOTAS</th>
//         <th>RISCO</th>
//         <th>AREA</th>
//         <th>PROCESSO</th>
//       </tr>
//     </thead>
//     <tbody>
//       {data.map((lin) => (
//         <tr key={lin.id}>
//           <td>{lin.itemName}</td>
//           <td>{lin.unitName}</td>
//           <td>{lin.uid}</td>
//           <td>{lin.dateDue}</td>
//           <td>{lin.dateOk}</td>
//           <td>{lin.result}</td>
//           <td width="20%">{lin.notes}</td>
//           <td>{lin.riskName}</td>
//           <td>{lin.areaName}</td>
//           <td>{lin.processName}</td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );
// };

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
