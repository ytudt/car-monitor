import axios from 'axios';
export function getUsers() {
  return axios.get('adminuser/list');
}

export function addUser(params) {
  return axios.post('adminuser/add', params);
}
