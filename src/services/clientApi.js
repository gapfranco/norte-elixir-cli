import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'

export function clientFind (id) {
  const gql = `
  query {
    client(cid: "${id}") {
      cid
      name
    }
  }
  `
  const body = {
    query: gql
  }
  return axios.post(`${apiUrl}`, body)
}
