import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listRisks (page = 0, size = 0, query = null) {
  let q = ''
  let c = '?'
  if (page) {
    q = `${c}p=${page}`
    c = '&'
  }
  if (query) {
    q += `${c}f=${query.f}&c=${query.q}&v=${query.v}`
    c = '&'
  }
  if (size) {
    q += `${c}s=${size}`
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

export function updateRisk (id, risk) {
  const reg = {
    risk
  }
  return axios.put(`${apiUrl}/risks/${id}`, reg, getAuthHeader())
}

export function createRisk (risk) {
  const reg = {
    risk
  }
  return axios.post(`${apiUrl}/risks`, reg, getAuthHeader())
}

export function deleteRisk (id) {
  return axios.delete(`${apiUrl}/risks/${id}`, getAuthHeader())
}
