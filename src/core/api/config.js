import axios from 'axios';
export function getUsers() {
  return axios.get('api/adminuser/list');
}

export function addUser(params) {
  return axios.post('api/adminuser/add', params);
}

export function delUser(id) {
  return axios.post(`api/adminuser/del/${id}`);
}

export function getRoles() {
  return axios.get('api/role/list');
}

export function addRole(params) {
  return axios.post('api/role/save', params);
}

export function delRole(id) {
  return axios.post(`api/role/del/${id}`);
}
