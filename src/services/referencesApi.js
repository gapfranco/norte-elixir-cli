import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listReferences (
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
  return axios.get(`${apiUrl}/references/sub/${id}/${q}`, getAuthHeader())
}

export function allReferences (period) {
  return axios.get(`${apiUrl}/references/all/${period}`, getAuthHeader())
}

export function showReference (id) {
  return axios.get(`${apiUrl}/references/${id}`, getAuthHeader())
}

export function updateReference (id, data) {
  return axios.put(`${apiUrl}/references/${id}`, data, getAuthHeader())
}

export function createReference (data) {
  return axios.post(`${apiUrl}/references`, data, getAuthHeader())
}

export function deleteReference (id) {
  return axios.delete(`${apiUrl}/references/${id}`, getAuthHeader())
}
