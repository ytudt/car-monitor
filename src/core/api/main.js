import axios from 'axios';
export function getVehicles() {
  return axios.get('api/vehicle/list');
}
export function getLocation(params) {
  // console.log(params);
  return axios.get('api/vehicle/location', {params});
}
