import axios from "axios"
import { SERVERURL } from "../utils/consts";

const $host = axios.create({
    baseURL: SERVERURL+ 'api/'
})

const $authHost = axios.create({
    baseURL: SERVERURL+ 'api/'
})


const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
}