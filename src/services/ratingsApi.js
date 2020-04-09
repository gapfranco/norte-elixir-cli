import axios from 'axios';
import {apiUrl} from '~/src/config/apiConfig';
import {getAuthHeader} from './authApi';
const moment = require('moment');

export function listRatings(page = 0, limit = 0, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : '';

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
          key name text
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

export function showRating(id) {
  const gql = `
  query {
    rating(id: ${id}) {
      id dateDue dateOk result notes
      unit {key name}
      item { key name text }
      area { key name }
      process { key name }
      risk { key name }
    }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}

export function updateRating(rating) {
  // let dateOk = moment().format('YYYY-MM-DD');

  const gql = `
  mutation($notes: String) {
    ratingUpdate(id: ${
      rating.id
    } notes: $notes result: ${rating.result.toUpperCase()}) {
      id 
    }
  }
  `;
  const body = {
    query: gql,
    variables: {
      notes: rating.notes,
    },
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader()).then(({data}) => {
    if (data.errors) {
      throw data.errors[0].message;
    }
  });
}

export function deleteRating(id) {
  const gql = `
  mutation {
    ratingDelete(id: "${id}") {
      id 
    }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}

export function listAllRatings(page = 0, limit = 0, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : '';
  const gql = `
  query {
    ratingsAll(page: ${page}, limit: ${limit} ${q} ) {
      count hasNext hasPrev nextPage prevPage page
      list {
        id
        dateDue
        dateOk
        result
        itemKey
        unitKey
        uid
        item {
          key name text
        }
        unit {
          id key name
        }
        user {
          email username
        }
        area {
          key name
        }
        process {
          key name
        }
        risk {
          key name
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
