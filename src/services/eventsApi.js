import axios from 'axios';
import {apiUrl} from '~/src/config/apiConfig';
import {getAuthHeader} from './authApi';

export function listEvents(page = 0, limit = 0, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : '';

  const gql = `
  query {
    events(page: ${page}, limit: ${limit} ${q} ) {
      count hasNext hasPrev nextPage prevPage page
      list {
        id uid eventDate text
        unitKey unitName
        itemKey itemName
        areaKey areaName
        riskKey riskName
        processKey processName
        user {
          username
        }
      }
    }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}

export function showEvent(id) {
  const gql = `
  query {
    event(id: ${id}) {
      id event_date itemName text
      unitKey unitName
      itemKey itemName
      areaKey areaName
      riskKey riskName
      processKey processName
  }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}

export function deleteEvent(id) {
  const gql = `
  mutation {
    eventDelete(id: "${id}") {
      id 
    }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}

export function listAllEvents(page = 0, limit = 0, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : '';
  const gql = `
  query {
    eventsAll(page: ${page}, limit: ${limit} ${q} ) {
      count hasNext hasPrev nextPage prevPage page
      list {
        id uid eventDate text
        unitKey unitName
        itemKey itemName
        areaKey areaName
        riskKey riskName
        processKey processName
        user {
          username
        }
      }
    }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}
