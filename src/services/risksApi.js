import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listRisks (page = 0, size = 0, query = null, order = null) {
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
  return axios.get(`${apiUrl}/risks/${q}`, getAuthHeader())
}

export function showRisk (id) {
  return axios.get(`${apiUrl}/risks/${id}`, getAuthHeader())
}

export function findRisk (uid) {
  return axios.get(`${apiUrl}/risks-find/${uid}`, getAuthHeader())
}

export function updateRisk (id, user) {
  return axios.put(`${apiUrl}/risks/${id}`, user, getAuthHeader())
}

export function createRisk (user) {
  return axios.post(`${apiUrl}/risks`, user, getAuthHeader())
}

export function deleteRisk (id) {
  return axios.delete(`${apiUrl}/risks/${id}`, getAuthHeader())
}
