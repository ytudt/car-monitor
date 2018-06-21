import axios from 'axios';
export function doLogin(params) {
  return axios.post('/admin/login', params);
}
