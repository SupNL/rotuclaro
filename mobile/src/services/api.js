import axios from 'axios';
import { API_BASEURL } from '@env';

const api = axios.create({
    baseURL : API_BASEURL
});

export default api;