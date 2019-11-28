import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'

export function clientFind (id) {
  return axios.get(`${apiUrl}/client-find/${id}`, getAuthHeader())
}
