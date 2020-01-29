import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'

const jwt = require('jsonwebtoken')

export function signIn (uid, password) {
  const gql = `
  mutation {
    signin(input: {uid: "${uid}" , password: "${password}"}) { 
      token 
    }
  }`
  const body = { query: gql }
  return axios.post(`${apiUrl}`, body).then(({ data }) => {
    if (data.data.signin) {
      localStorage.setItem('token', data.data.signin.token)
    } else {
      throw (data.errors[0].message)
    }
  })
}

export function signUpUser (cid, clientname, usr, email, username, password) {
  const gql = `
  mutation {
    signup(input: {cid: "${cid}", name: "${clientname}", uid: "${usr}@${cid}", email: "${email}", 
    username: "${username}", password: "${password}", password_confirmation: "${password}"}) { 
      cid
      name 
    }
  }`
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body).then(({ data }) => {
    if (data.errors) {
      throw data.errors[0].message
    }
  })
}

export function welcome (uid) {
  const body = { uid }
  console.log(body)
  return axios.post(`${apiUrl}/welcome`, body)
}

export function resetPassword (uid) {
  const gql = `
  mutation {
    forgotPassword(uid: "${uid}") { 
      msg
    }
  }`
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body)
}

export function newPassword (uid, token, password, passwordConfirmation) {
  const gql = `
  mutation {
    createPassword(input: {uid: "${uid}", token: "${token}",  
    password: "${password}", password_confirmation: "${passwordConfirmation}"}) { 
      msg
    }
  }`
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body).then(({ data }) => {
    if (data.errors) {
      throw data.errors[0].message
    }
  })
}

export function changePassword (oldPassword, password, confirmPassword) {
  const gql = `
  mutation {
    changePassword(oldPassword: "${oldPassword}", password: "${password}", passwordConfirmation: "${confirmPassword}") { 
      msg
    }
  }`
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader()).then(({ data }) => {
    if (data.errors) {
      throw data.errors[0].message
    }
  })
}

export function signOut () {
  localStorage.removeItem('token')
}

export function verifyAuthToken (token) {
  // const decoded = jwt.decode(token)
  //  const agora = Math.floor(Date.now() / 1000);
  //  return agora <= decoded.exp;
  if (token) {
    return true
  }
}

export function isAuthenticated () {
  const token = localStorage.getItem('token')
  if (verifyAuthToken(token)) {
    return true
  }
  signOut()
  console.warn('Token expirou!')
  return false
}

export function getAuthHeader () {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export function getUserId () {
  const token = localStorage.getItem('token')
  const decoded = jwt.decode(token)
  return decoded.sub
}

export function getUserToken () {
  const result = localStorage.getItem('token')
  return result
}
