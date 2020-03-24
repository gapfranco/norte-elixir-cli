import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'
const moment = require('moment')

export function listRatings (page = 0, limit = 0, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : ''

  const gql = `
  query {
    ratings(page: ${page}, limit: ${limit} ${q} ) {
      count hasNext hasPrev nextPage prevPage page
      list {
        id
        dateDue
        dateOk
        result
        item {
          key name
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

export function showRating (id) {
  const gql = `
  query {
    rating(id: ${id}) {
      dateDue dateOk 
      unit {key name}
      item { key name }
      area { key name }
      process { key name }
      risk { key name }
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}

export function updateRating (rating) {
  let dateOk = moment().format('YYYY-MM-DD')

  const gql = `
  mutation {
    ratingUpdate(id: ${rating.id}, date_ok: "${dateOk}" notes: "${rating.notes}" result: ${rating.result}) {
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

export function deleteRating (id) {
  const gql = `
  mutation {
    ratingDelete(id: "${id}") {
      id 
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body, getAuthHeader())
}
