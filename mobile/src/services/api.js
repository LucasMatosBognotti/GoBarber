import axios from 'axios';

const api = axios.create({
  baseURL: 'exp://192.168.0.7:3333'
});

export default api;