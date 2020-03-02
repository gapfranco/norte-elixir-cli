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

export function showMapping (id) {
  const gql = `
  query {
      mapping(id: ${id}) {
      id 
      unit {
        key name
      } 
      user {
        uid username
      }
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}

export function updateMapping (mapping) {
  const gql = `
    mutation {
      mappingUpdate(
        itemKey: "${mapping.item_key}", 
        unitKey: "${mapping.unit_key}", 
        userKey: "${mapping.user_key}"
      ) {
        id
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

export function createMapping (mapping) {
  console.log('CRIANDO', mapping)

  const gql = `
    mutation {
      mappingCreate(
        itemKey: "${mapping.item_key}", 
        unitKey: "${mapping.unit_key}", 
        userKey: "${mapping.user_key}"
      ) {
        id
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

export function deleteMapping (mapping) {
  const gql = `
    mutation {
      mappingDelete(
        itemKey: "${mapping.item_key}", 
        unitKey: "${mapping.unit_key}" 
      ) {
        id
      }
    }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}
