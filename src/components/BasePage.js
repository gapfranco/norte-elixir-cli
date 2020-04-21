import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Layout, Menu, Icon, Row, Col} from 'antd';
import {signOut} from '~/src/services/authApi';
import {bindActionCreators} from 'redux';

import {Creators as menuActions} from '~/src/redux/ducks/menu';
import {Creators as userActions} from '~/src/redux/ducks/user';
import {Creators as pageActions} from '~/src/redux/ducks/page';
import {Creators as orderActions} from '~/src/redux/ducks/order';
import {Creators as queryActions} from '~/src/redux/ducks/query';

const {Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

class BasePage extends React.Component {
  state = {};

  componentDidMount() {
    this.setState({component: this.props.component || null});
  }

  onCollapse = (collapsed) => {
    this.props.menuActions.setMenu(collapsed);
  };

  handleLink = (opc) => {
    // reset redux page states
    this.props.pageActions.setPage(null);
    this.props.orderActions.setOrder(null);
    this.props.queryActions.setQuery(null);
    this.props.history.push(opc);
  };

  handleDisconnect = () => {
    signOut();
    this.props.userActions.signOut();
    this.props.history.push('/signin');
  };

  render() {
    return (
      <Fragment>
        <Layout style={{minHeight: '100vh'}}>
          <Sider
            collapsible
            collapsed={this.props.menu}
            onCollapse={this.onCollapse}>
            <Row type="flex" justify="center" align="middle">
              <Col justify="center">
                <div style={styles.logo}>NORTE</div>
              </Col>
            </Row>
            <Menu theme="dark" mode="inline">
              <Menu.Item key="1" onClick={() => this.handleLink('/')}>
                <Icon type="home" />
                <span>Home</span>
              </Menu.Item>
              <Menu.Item key="dash" onClick={() => this.handleLink('/')}>
                <Icon type="dashboard" />
                <span>Painel</span>
              </Menu.Item>

              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="login" />
                    <span>Conexão</span>
                  </span>
                }>
                {/* <Menu.Item key='2' onClick={this.handleDisconnect}> */}
                <Menu.Item key="4" onClick={() => this.handleLink('/account')}>
                  <Icon type="info-circle" />
                  Informações
                </Menu.Item>
                <Menu.Item
                  key="3"
                  onClick={() => this.handleLink('/changepassword')}>
                  <Icon type="safety" />
                  Alterar senha
                </Menu.Item>
                <Menu.Item key="31" onClick={this.handleDisconnect}>
                  <Icon type="disconnect" />
                  Desconectar
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="table" />
                    <span>Cadastro</span>
                  </span>
                }>
                <Menu.Item key="4" onClick={() => this.handleLink('/users')}>
                  <Icon type="team" />
                  Usuários
                </Menu.Item>
                <Menu.Item key="5" onClick={() => this.handleLink('/units')}>
                  <Icon type="bank" />
                  Unidades
                </Menu.Item>
                <Menu.Item key="7" onClick={() => this.handleLink('/areas')}>
                  <Icon type="apartment" />
                  Áreas
                </Menu.Item>
                <Menu.Item
                  key="6"
                  onClick={() => this.handleLink('/processes')}>
                  <Icon type="share-alt" />
                  Processos
                </Menu.Item>
                <Menu.Item key="8" onClick={() => this.handleLink('/risks')}>
                  <Icon type="thunderbolt" />
                  Riscos
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="sub3"
                title={
                  <span>
                    <Icon type="check" />
                    <span>Conformidade</span>
                  </span>
                }>
                <Menu.Item
                  key="items"
                  onClick={() => this.handleLink('/items')}>
                  <Icon type="profile" />
                  Itens
                </Menu.Item>

                <Menu.Item
                  key="tests"
                  onClick={() => this.handleLink('/ratings')}>
                  <Icon type="sync" />
                  Testes
                </Menu.Item>

                {/* <Menu.Item key='quest' onClick={() => this.handleLink('/')}>
                  <Icon type='question' />
                  Questionários
                </Menu.Item> */}
              </SubMenu>

              <SubMenu
                key="sub4"
                title={
                  <span>
                    <Icon type="flag" />
                    <span>Aderencia</span>
                  </span>
                }>
                <Menu.Item
                  key="results"
                  onClick={() => this.handleLink('/results')}>
                  <Icon type="upload" />
                  Resultados
                </Menu.Item>

                <Menu.Item
                  key="actions"
                  onClick={() => this.handleLink('/report-result')}>
                  <Icon type="file-text" />
                  Relatório
                </Menu.Item>

                <Menu.Item
                  key="events"
                  onClick={() => this.handleLink('/events')}>
                  <Icon type="thunderbolt" />
                  Apontamentos
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{margin: '16px 16px'}}>
              {this.state.component}
            </Content>
            <Footer style={{textAlign: 'center'}}>M2I Consultoria ©2020</Footer>
          </Layout>
        </Layout>
      </Fragment>
    );
  }
}

const styles = {
  logo: {
    margin: '16px',
    color: 'orange',
  },
};

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userActions: bindActionCreators(userActions, dispatch),
    menuActions: bindActionCreators(menuActions, dispatch),
    pageActions: bindActionCreators(pageActions, dispatch),
    orderActions: bindActionCreators(orderActions, dispatch),
    queryActions: bindActionCreators(queryActions, dispatch),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BasePage),
);
