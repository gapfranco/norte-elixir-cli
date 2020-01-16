import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listUser (page = 0, size = 0, query = null, order = null) {
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
  return axios.get(`${apiUrl}/users/${q}`, getAuthHeader())
}

export function showUser (id) {
  return axios.get(`${apiUrl}/users/${id}`, getAuthHeader())
}

export function findUser (uid) {
  return axios.get(`${apiUrl}/users-uid/${uid}`, getAuthHeader())
}

export function updateUser (id, user) {
  const reg = {
    user: user
  }
  return axios.put(`${apiUrl}/users/${id}`, reg, getAuthHeader())
}

export function createUser (user) {
  const reg = {
    user: user
  }
  return axios.post(`${apiUrl}/users`, reg, getAuthHeader())
}

export function deleteUser (id) {
  return axios.delete(`${apiUrl}/users/${id}`, getAuthHeader())
}

export async function isAdmin (id) {
  const reg = await showUser(id)
  return reg.data.data.admin
}

export async function isBlocked (id) {
  const reg = await showUser(id)
  return reg.data.data.block
}
