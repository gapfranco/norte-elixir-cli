import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listIndicators (page = 0, size = 0, query = null, order = null) {
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
  return axios.get(`${apiUrl}/indicators/${q}`, getAuthHeader())
}

export function showIndicator (id) {
  return axios.get(`${apiUrl}/indicators/${id}`, getAuthHeader())
}

export function updateIndicator (id, user) {
  return axios.put(`${apiUrl}/indicators/${id}`, user, getAuthHeader())
}

export function createIndicator (user) {
  return axios.post(`${apiUrl}/indicators`, user, getAuthHeader())
}

export function deleteIndicator (id) {
  return axios.delete(`${apiUrl}/indicators/${id}`, getAuthHeader())
}
