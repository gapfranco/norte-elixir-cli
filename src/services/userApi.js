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
        id
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

export function showUser (uid) {
  const gql = `
  query {
    user(uid: "${uid}") {
      id uid username admin block email
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}

export function updateUser (user) {
  const gql = `
  mutation {
    userUpdate(uid: "${user.uid}", username: "${user.username}", email: "${user.email}", 
    admin: ${user.admin}, block: ${user.block}) {
      uid 
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader()).then(({ data }) => {
    if (data.errors) {
      throw data.errors[0].message
    }
  })
}

export function createUser (user) {
  const gql = `
  mutation {
    userCreate(uid: "${user.uid}", username: "${user.username}", email: "${user.email}") {
      uid 
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader()).then(({ data }) => {
    if (data.errors) {
      throw data.errors[0].message
    }
  })
}

export function deleteUser (id) {
  const gql = `
  mutation {
    userDelete(uid: "${id}") {
      uid 
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}

export async function isAdmin () {
  const reg = await me()
  return reg.data.data.me.admin
}

export async function isBlocked (id) {
  const reg = await showUser(id)
  return reg.data.data.block
}
