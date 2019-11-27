import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BasePage from '~/src/components/BasePage'

// import { calcVariablesPeriod } from '~/src/components/Util'

class Fundo extends React.Component {
  render () {
    // Parse de valores para formulas
    // const str = '({2.1} - {1.1}) / {2.1} * {3.0} {4}'
    // const reg = {
    //   '2.1': 2100.5,
    //   '1.1': 1101,
    //   '3.0': 3001.01
    // }
    // const str = '{1.1} / {2.1}'
    // calcVariablesPeriod(str, '2019-06').then(res => console.log(res))
    // console.log(chg)
    return null
  }
}

class MainPage extends React.Component {
  render () {
    return <BasePage component={<Fundo />} />
  }
}

const mapStateToProps = state => ({
  ...state
})

export default withRouter(connect(mapStateToProps)(MainPage))
