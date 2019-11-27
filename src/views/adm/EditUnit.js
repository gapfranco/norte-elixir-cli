import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import AlertDialog from '../../components/AlertDialog'
import ConfirmDialog from '../../components/ConfirmDialog'
import Launch from '@material-ui/icons/Launch'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import HeadMenuBar from '../../components/HeadToolBar'

import {
  showUnit,
  updateUnit,
  createUnit,
  deleteUnit,
  listSubUnit
} from '../../api/unitApi'
import SubListGeneric from '../../components/SubListGeneric'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    width: '60%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  card: {
    width: '80%',
    marginTop: theme.spacing.unit * 3
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  input: {
    margin: 8
  },
  pos: {
    marginBottom: 12
  },
  actions: {
    padding: 6
  }
})

class EditUnit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      unit: null,
      open: false
    }
  }

  componentDidMount () {
    const top = this.props.match.params.top
    const id = this.props.match.params.id
    if (id === '+') {
      this.setState({
        unit: { id: '', name: '', top_id: top },
        loaded: true,
        id,
        top
      })
    } else {
      showUnit(id)
        .then(res => {
          this.setState({
            unit: res.data,
            loaded: true,
            id,
            top
          })
        })
        .catch(error => {
          this.setState({ error, loaded: true })
        })
    }
  }

  submitUpdate = () => {
    if (this.state.id === '+') {
      createUnit(this.state.unit)
        .then(() => {
          this.props.history.goBack()
        })
        .catch(() => {
          this.setState({ error: 'Erro de gravação no servidor', loaded: true })
        })
    } else {
      updateUnit(this.state.unit)
        .then(() => {
          this.props.history.goBack()
        })
        .catch(() => {
          this.setState({ error: 'Erro de gravação no servidor', loaded: true })
        })
    }
  }

  submitDelete = () => {
    this.setState({
      confirm: `Confirme exclusão da unidade ${this.state.unit.name}`
    })
  }

  cancelDelete = () => {
    this.setState({ confirm: null })
  }

  deleteUnit = () => {
    this.setState({ confirm: null })
    deleteUnit(this.state.unit.id)
      .then(() => {
        this.props.history.goBack()
      })
      .catch(() => {
        this.setState({ error: 'Erro de gravação no servidor', loaded: true })
      })
  }

  setField = prop => event => {
    this.setState({
      unit: { ...this.state.unit, [prop]: event.target.value }
    })
  }

  goBack = () => {
    this.props.history.goBack()
  }

  close = () => {
    this.setState({
      open: false
    })
  }

  show = () => {
    this.setState({
      open: true
    })
  }

  closeError = () => {
    this.setState({ error: null })
  }

  render () {
    const { classes } = this.props
    if (!this.state.loaded) {
      return null
    }
    const nivel = Object.keys(this.props.match.params).length
    return (
      <div>
        <HeadMenuBar />
        <Grid
          container
          className={classes.root}
          direction='row'
          justify='center'
          alignItems='center'
        >
          {this.state.error ? (
            <AlertDialog
              title='Ocorreu um erro'
              message={this.state.error}
              handleClose={this.closeError}
            />
          ) : null}
          {this.state.confirm ? (
            <ConfirmDialog
              title='Exclusão'
              message={this.state.confirm}
              handleCancel={this.cancelDelete}
              handleConfirm={this.deleteUnit}
            />
          ) : null}
          <Card className={classes.card}>
            <CardContent>
              <Grid container direction='row' justify='space-between'>
                <Grid item>
                  <Typography gutterBottom variant='h6' component='h2'>
                    Unidade
                  </Typography>
                  <Typography className={classes.title} color='textSecondary'>
                    {this.state.id
                      ? 'Manutenção de unidade'
                      : 'Inclusão de unidade'}
                  </Typography>
                </Grid>
                <Grid item>
                  <Tooltip title='Sair'>
                    <IconButton
                      aria-label='Exit'
                      onClick={() => this.props.history.push('/')}
                    >
                      <Launch />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid container direction='column' justify='flex-start'>
                <FormControl className={classes.input}>
                  <InputLabel htmlFor='name'>Código</InputLabel>
                  <Input
                    id='id'
                    required
                    autoComplete='off'
                    value={this.state.unit.id}
                    onChange={this.setField('id')}
                  />
                </FormControl>
                <FormControl className={classes.input}>
                  <InputLabel htmlFor='name'>Nome</InputLabel>
                  <Input
                    id='name'
                    required
                    autoComplete='off'
                    value={this.state.unit.name}
                    onChange={this.setField('name')}
                  />
                </FormControl>
              </Grid>

              {this.state.id !== '+' && nivel < 3 ? (
                <Grid container direction='column' justify='flex-start'>
                  <SubListGeneric
                    title='Unidades subordinadas'
                    detail={`/unit${
                      this.state.top ? '/' + this.state.top : ''
                    }`}
                    list={listSubUnit}
                    size={5}
                    id={this.state.id}
                    qry={[
                      { key: 'id', name: 'Código', type: 'text' },
                      { key: 'name', name: 'Nome', type: 'text' }
                    ]}
                    table={[
                      {
                        name: 'Código',
                        col: 'id',
                        type: 'text',
                        style: { width: '10%' }
                      },
                      {
                        name: 'Nome',
                        col: 'name',
                        type: 'text',
                        style: { width: '90%' }
                      }
                    ]}
                  />
                </Grid>
              ) : null}
            </CardContent>
            <CardActions>
              <Grid
                container
                direction='row'
                justify='space-between'
                alignItems='center'
                className={classes.actions}
              >
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.submitUpdate}
                >
                  Salvar
                </Button>
                {this.state.isLoading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
                {this.state.id !== '+' ? (
                  <Button
                    style={{ color: '#f44336' }}
                    onClick={this.submitDelete}
                  >
                    Excluir
                  </Button>
                ) : null}
                <Button
                  color='primary'
                  onClick={() => this.props.history.goBack()}
                >
                  Voltar
                </Button>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(EditUnit))
)
