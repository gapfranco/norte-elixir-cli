import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'

const jwt = require('jsonwebtoken')

export function signIn (uid, password) {
  const body = { uid, password }
  return axios.post(`${apiUrl}/signin`, body).then(res => {
    localStorage.setItem('token', res.data.token)
  })
}

export function signUpUser (cid, clientname, usr, email, username, password) {
  const body = { cid, clientname, usr, email, username, password }
  return axios.post(`${apiUrl}/signup`, body)
}

export function resetPassword (uid) {
  const body = { uid }
  return axios.post(`${apiUrl}/password`, body)
}

export function newPassword (token, password) {
  const body = { token, password }
  return axios.put(`${apiUrl}/password`, body)
}

export function changePassword (userId, oldPassword, newPassword) {
  const body = { oldPassword, newPassword }
  return axios.post(`${apiUrl}/password/${userId}`, body, getAuthHeader())
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
  return decoded.uid
}

export function getUserToken () {
  const result = localStorage.getItem('token')
  return result
}
