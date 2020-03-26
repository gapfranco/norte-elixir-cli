import axios from 'axios';
import {apiUrl} from '~/src/config/apiConfig';
import {getAuthHeader} from './authApi';

export function listItems(page = 0, limit = 0, filter = null) {
  const q = filter ? `, filter: {matching: "${filter}"}` : '';

  const gql = `
  query {
    items(page: ${page}, limit: ${limit} ${q} ) {
      count hasNext hasPrev nextPage prevPage page
      list {
        key
        name
        freq
        base
      }
    }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}

export function showItem(key) {
  const gql = `
  query {
    item(key: "${key}") {
      id key name text freq base 
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

export function updateItem(item) {
  let per = '';
  let bas = '';
  let are = '';
  let pro = '';
  let ris = '';
  if (item.freq) {
    per = `, freq: ${item.freq.toUpperCase()}`;
  } else if (item.freq === '') {
    per = `, freq: null`;
  }
  if (item.base) {
    bas = `, base: "${item.base.format('YYYY-MM-DD')}"`;
  } else if (item.base === '') {
    bas = `, base: null`;
  }
  if (item.area_key) {
    are = `, areaKey: "${item.area_key}"`;
  } else if (item.area_key === '') {
    are = `, areaKey: null`;
  }
  if (item.risk_key) {
    ris = `, riskKey: "${item.risk_key}"`;
  } else if (item.risk_key === '') {
    ris = `, riskKey: null`;
  }
  if (item.process_key) {
    pro = `, processKey: "${item.process_key}"`;
  } else if (item.process_key === '') {
    pro = `, processKey: null`;
  }
  const gql = `
  mutation($text: String) {
    itemUpdate(key: "${item.key}", name: "${item.name}" text: $text ${per} ${bas} ${are} ${ris} ${pro}) {
      key 
    }
  }
  `;
  const body = {
    query: gql,
    variables: {
      text: item.text,
    },
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader()).then(({data}) => {
    if (data.errors) {
      throw data.errors[0].message;
    }
  });
}

export function createItem(item) {
  let per = '';
  let bas = '';
  let are = '';
  let pro = '';
  let ris = '';
  if (item.freq) {
    per = `, freq: ${item.freq.toUpperCase()}`;
  } else if (item.freq === '') {
    per = `, freq: null`;
  }
  if (item.base) {
    bas = `, base: "${item.base.format('YYYY-MM-DD')}"`;
  } else if (item.base === '') {
    bas = `, base: null`;
  }
  if (item.area_key) {
    are = `, areaKey: "${item.area_key}"`;
  } else if (item.area_key === '') {
    are = `, areaKey: null`;
  }
  if (item.risk_key) {
    ris = `, riskKey: "${item.risk_key}"`;
  } else if (item.risk_key === '') {
    ris = `, riskKey: null`;
  }
  if (item.process_key) {
    pro = `, processKey: "${item.process_key}"`;
  } else if (item.process_key === '') {
    pro = `, processKey: null`;
  }
  const gql = `
  mutation {
    itemCreate(key: "${item.key}", name: "${item.name}" text: "${item.text}" ${per} ${bas} ${are} ${ris} ${pro}) {
      key 
    }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader()).then(({data}) => {
    if (data.errors) {
      throw data.errors[0].message;
    }
  });
}

export function deleteItem(id) {
  const gql = `
  mutation {
    itemDelete(key: "${id}") {
      key 
    }
  }
  `;
  const body = {
    query: gql,
  };
  return axios.post(`${apiUrl}`, body, getAuthHeader());
}
