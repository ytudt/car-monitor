import axios from 'axios';

axios.defaults.timeout = 5000;
axios.interceptors.request.use((request) => {
  const host = location.host;
  if (request.url.indexOf('http') !== 0){
    let url = request.url.replace('/api', 'api');
    request.url = `${host}/${url}`;
  }
  return request;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  return response;
}, (err) => {
  if(err.response && (err.response.status == 401)) return alert('全局拦截401~');
  return Promise.reject(err);
});
