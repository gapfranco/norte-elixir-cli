import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader, me } from './authApi'

export function listUser (page = 1, limit = 10, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : ''

  const gql = `
  query {
    users(page: ${page}, limit: ${limit} ${q} ) {
      count hasNext hasPrev nextPage prevPage page
      list {
        uid
        username
        admin
        block
        email
      }
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
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

export async function isAdmin () {
  const reg = await me()
  return reg.data.data.me.admin
}

export async function isBlocked (id) {
  const reg = await showUser(id)
  return reg.data.data.block
}
