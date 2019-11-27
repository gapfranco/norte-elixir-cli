import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listPeriods (page = 0, size = 0, query = null, order = null) {
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
  return axios.get(`${apiUrl}/periods/${q}`, getAuthHeader())
}

export function showPeriod (id) {
  return axios.get(`${apiUrl}/periods/${id}`, getAuthHeader())
}

export function updatePeriod (id, user) {
  return axios.put(`${apiUrl}/periods/${id}`, user, getAuthHeader())
}

export function createPeriod (user) {
  return axios.post(`${apiUrl}/periods`, user, getAuthHeader())
}

export function deletePeriod (id) {
  return axios.delete(`${apiUrl}/periods/${id}`, getAuthHeader())
}

export function loadPeriod (period, file) {
  return axios.get(`${apiUrl}/periods/load/${period}/${file}`, getAuthHeader())
}

export function calcPeriod (period) {
  return axios.get(`${apiUrl}/periods/calc/${period}`, getAuthHeader())
}
