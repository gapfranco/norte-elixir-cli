import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function listMappings (itemKey, page = 0, limit = 0, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : ''
  const gql = `
  query {
    mappings(itemKey: "${itemKey}" page: ${page}, limit: ${limit} ${q} ) {
      count hasNext hasPrev nextPage prevPage page
      list {
        id
        unit {
          key
          name
        }
        user {
          uid
          username
        }
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
    mapping(key: "${key}") {
      id key name
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}

export function updateItem (mapping) {
  const gql = `
  mutation {
    mappingUpdate(key: "${mapping.key}", name: "${mapping.name}") {
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

export function createItem (mapping) {
  const gql = `
  mutation {
    mappingCreate(key: "${mapping.key}", name: "${mapping.name}") {
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
    mappingDelete(key: "${id}") {
      key 
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}
