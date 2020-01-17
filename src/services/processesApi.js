import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listProcesses (page = 0, size = 0, query = null) {
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
  return axios.get(`${apiUrl}/processes/${q}`, getAuthHeader())
}

export function showProcess (id) {
  return axios.get(`${apiUrl}/processes/${id}`, getAuthHeader())
}

export function findProcess (uid) {
  return axios.get(`${apiUrl}/processes-find/${uid}`, getAuthHeader())
}

export function updateProcess (id, process) {
  const reg = {
    process
  }
  return axios.put(`${apiUrl}/processes/${id}`, reg, getAuthHeader())
}

export function createProcess (process) {
  const reg = {
    process
  }
  return axios.post(`${apiUrl}/processes`, reg, getAuthHeader())
}

export function deleteProcess (id) {
  return axios.delete(`${apiUrl}/processes/${id}`, getAuthHeader())
}
