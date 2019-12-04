import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listAreas (page = 0, size = 0, query = null, order = null) {
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
  return axios.get(`${apiUrl}/areas/${q}`, getAuthHeader())
}

export function showArea (id) {
  return axios.get(`${apiUrl}/areas/${id}`, getAuthHeader())
}

export function findArea (uid) {
  return axios.get(`${apiUrl}/areas-find/${uid}`, getAuthHeader())
}

export function updateArea (id, user) {
  return axios.put(`${apiUrl}/areas/${id}`, user, getAuthHeader())
}

export function createArea (user) {
  return axios.post(`${apiUrl}/areas`, user, getAuthHeader())
}

export function deleteArea (id) {
  return axios.delete(`${apiUrl}/areas/${id}`, getAuthHeader())
}
