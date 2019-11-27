import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listMeasures (
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
  return axios.get(`${apiUrl}/measures/sub/${id}/${q}`, getAuthHeader())
}

export function allMeasures (period) {
  return axios.get(`${apiUrl}/measures/all/${period}`, getAuthHeader())
}

export function showMeasure (period, indicator) {
  return axios.get(`${apiUrl}/measures/${period}/${indicator}`, getAuthHeader())
}

export function updateMeasure (period, indicator, balance) {
  return axios.put(
    `${apiUrl}/measures/${period}/${indicator}`,
    balance,
    getAuthHeader()
  )
}

export function createMeasure (data) {
  return axios.post(`${apiUrl}/measures`, data, getAuthHeader())
}

export function deleteMeasure (period, indicator) {
  return axios.delete(
    `${apiUrl}/measures/${period}/${indicator}`,
    getAuthHeader()
  )
}
