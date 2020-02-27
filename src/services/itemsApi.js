import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listItems (page = 0, limit = 0, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : ''

  const gql = `
  query {
    items(page: ${page}, limit: ${limit} ${q} ) {
      count hasNext hasPrev nextPage prevPage page
      list {
        key
        name
      }
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}

export function showItem (key) {
  const gql = `
  query {
    item(key: "${key}") {
      id key name
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}

export function updateItem (item) {
  const gql = `
  mutation {
    itemUpdate(key: "${item.key}", name: "${item.name}") {
      key 
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

export function createItem (item) {
  const gql = `
  mutation {
    itemCreate(key: "${item.key}", name: "${item.name}") {
      key 
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

export function deleteItem (id) {
  const gql = `
  mutation {
    itemDelete(key: "${id}") {
      key 
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}
