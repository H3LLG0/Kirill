import { $host, $authHost } from ".";
import { jwtDecode } from "jwt-decode";


export const getLogin = async (login, password) => {
    const {data} = await $host.post('user/login', {login, password})
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
}

export const check = async() => {
    const {data} = await $authHost.get('user/check',{headers: {
        'Authorization': `${localStorage.getItem('token')}`
    }});
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
}