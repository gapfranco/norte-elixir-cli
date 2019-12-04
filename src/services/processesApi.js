import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listProcesses (page = 0, size = 0, query = null, order = null) {
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
  return axios.get(`${apiUrl}/processes/${q}`, getAuthHeader())
}

export function showProcess (id) {
  return axios.get(`${apiUrl}/processes/${id}`, getAuthHeader())
}

export function findProcess (uid) {
  return axios.get(`${apiUrl}/processes-find/${uid}`, getAuthHeader())
}

export function updateProcess (id, user) {
  return axios.put(`${apiUrl}/processes/${id}`, user, getAuthHeader())
}

export function createProcess (user) {
  return axios.post(`${apiUrl}/processes`, user, getAuthHeader())
}

export function deleteProcess (id) {
  return axios.delete(`${apiUrl}/processes/${id}`, getAuthHeader())
}
