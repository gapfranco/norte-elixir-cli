import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listUnits (page = 0, size = 0, query = null) {
  let q = ''
  let c = '?'
  if (page) {
    q = `${c}p=${page}`
    c = '&'
  }
  if (query) {
    q += `${c}f=${query.f}&c=${query.c}&v=${query.v}`
    c = '&'
  }
  if (size) {
    q += `${c}s=${size}`
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

export function updateUnit (id, unit) {
  const reg = {
    unit
  }
  return axios.put(`${apiUrl}/units/${id}`, reg, getAuthHeader())
}

export function createUnit (unit) {
  const reg = {
    unit
  }
  return axios.post(`${apiUrl}/units`, reg, getAuthHeader())
}

export function deleteUnit (id) {
  return axios.delete(`${apiUrl}/units/${id}`, getAuthHeader())
}
