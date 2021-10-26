import axios from 'axios';
import { API_BASEURL } from '@env';

console.log(API_BASEURL);

const TIMEOUT = 20000;

const api = axios.create({
    baseURL : API_BASEURL,
    timeout : TIMEOUT,
});

export const uninterceptedApi = axios.create({
    baseURL : API_BASEURL,
    timeout : TIMEOUT,
});

export default api;