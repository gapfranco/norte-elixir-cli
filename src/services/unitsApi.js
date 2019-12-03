import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listUnits (page = 0, size = 0, query = null, order = null) {
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
  return axios.get(`${apiUrl}/units/${q}`, getAuthHeader())
}

export function showUnit (id) {
  return axios.get(`${apiUrl}/units/${id}`, getAuthHeader())
}

export function findUnit (uid) {
  return axios.get(`${apiUrl}/units-find/${uid}`, getAuthHeader())
}

export function updateUnit (id, user) {
  return axios.put(`${apiUrl}/units/${id}`, user, getAuthHeader())
}

export function createUnit (user) {
  return axios.post(`${apiUrl}/units`, user, getAuthHeader())
}

export function deleteUnit (id) {
  return axios.delete(`${apiUrl}/units/${id}`, getAuthHeader())
}
