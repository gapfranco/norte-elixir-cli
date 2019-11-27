import axios from 'axios'
import { apiUrl } from '~/src/config/apiConfig'
import { getAuthHeader } from './authApi'


export function clientExists (id) {
  return axios.get(`${apiUrl}/client-exists/${id}`, getAuthHeader())
}

