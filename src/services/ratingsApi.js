import axios from 'axios';
import {apiUrl} from '~/src/config/apiConfig';
import {getAuthHeader} from './authApi';

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
        itemKey itemName
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
      unitKey unitName
      itemKey itemName itemText
      areaKey areaName
      processKey processName
      riskKey riskName
      user {
        email username
      }

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
        itemKey itemName
        unitKey unitName
        areaKey areaName
        riskKey riskName
        processKey processName
        uid
        user {
          email username
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

export function reportRatings(filter) {
  // const q = filter ? `, filter: {matching: "${filter}"}` : '';
  const gql = `
  query($dateIni: String, $dateEnd: String, $process: String, $area: String, $risk: String, $item: String, $unit: String) {
    ratingsReport(dateIni: $dateIni dateEnd: $dateEnd process: $process risk: $risk area: $area item: $item unit: $unit) {
        id
        dateDue
        dateOk
        result
        itemKey itemName itemText
        unitKey unitName
        areaKey areaName
        riskKey riskName
        processKey processName
        uid notes
    }
  }
  `;
  const body = {
    query: gql,
    variables: {
      dateIni: filter.date_ini,
      dateEnd: filter.date_end,
      process: filter.process,
      area: filter.area,
      risk: filter.risk,
      item: filter.item,
      unit: filter.unit,
    },
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}
