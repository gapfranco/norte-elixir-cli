import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listAreas (page = 0, size = 0, query = null) {
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
  return axios.get(`${apiUrl}/areas/${q}`, getAuthHeader())
}

export function showArea (id) {
  return axios.get(`${apiUrl}/areas/${id}`, getAuthHeader())
}

export function findArea (uid) {
  return axios.get(`${apiUrl}/areas-find/${uid}`, getAuthHeader())
}

export function updateArea (id, area) {
  const reg = {
    area
  }
  return axios.put(`${apiUrl}/areas/${id}`, reg, getAuthHeader())
}

export function createArea (area) {
  const reg = {
    area
  }
  return axios.post(`${apiUrl}/areas`, reg, getAuthHeader())
}

export function deleteArea (id) {
  return axios.delete(`${apiUrl}/areas/${id}`, getAuthHeader())
}
