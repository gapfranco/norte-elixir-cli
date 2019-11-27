import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listBalances (
  id,
  page = 0,
  size = 0,
  query = null,
  order = null
) {
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
  return axios.get(`${apiUrl}/balances/sub/${id}/${q}`, getAuthHeader())
}

export function showBalance (period, account) {
  return axios.get(`${apiUrl}/balances/${period}/${account}`, getAuthHeader())
}

export function updateBalance (period, account, balance) {
  return axios.put(
    `${apiUrl}/balances/${period}/${account}`,
    balance,
    getAuthHeader()
  )
}

export function createBalance (user) {
  return axios.post(`${apiUrl}/balances`, user, getAuthHeader())
}

export function deleteBalance (id) {
  return axios.delete(`${apiUrl}/balances/${id}`, getAuthHeader())
}
