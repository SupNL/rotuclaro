import axios from 'axios';
import { API_BASEURL } from '@env';

const TIMEOUT = 10000;

console.log(API_BASEURL);

const api = axios.create({
    baseURL : API_BASEURL,
    timeout : TIMEOUT,
});

export const uninterceptedApi = axios.create({
    baseURL : API_BASEURL,
    timeout : TIMEOUT,
});

export default api;