import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listAccounts (page = 0, size = 0, query = null, order = null) {
  let q = ''
  let c = '?'
  if (page) {
    q = `${c}page=${page}`
    c = '&'
  }
  if (query) {
    q += `${c}f=${query.f}&q=${query.q}&v=${query.v}`
    // q += `${c}f=username&q=c&v=${query.v}`
    c = '&'
  }
  if (order) {
    q += `${c}order=${order}`
    c = '&'
  }
  if (size) {
    q += `${c}size=${size}`
    c = '&'
  }
  return axios.get(`${apiUrl}/accounts/${q}`, getAuthHeader())
}

export function showAccount (id) {
  return axios.get(`${apiUrl}/accounts/${id}`, getAuthHeader())
}

export function updateAccount (id, user) {
  return axios.put(`${apiUrl}/accounts/${id}`, user, getAuthHeader())
}

export function createAccount (user) {
  return axios.post(`${apiUrl}/accounts`, user, getAuthHeader())
}

export function deleteAccount (id) {
  return axios.delete(`${apiUrl}/accounts/${id}`, getAuthHeader())
}
