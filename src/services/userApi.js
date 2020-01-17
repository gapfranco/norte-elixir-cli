import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listUser (page = 0, size = 0, query = null) {
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
