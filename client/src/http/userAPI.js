import { $host, $authHost } from ".";
import { jwtDecode } from "jwt-decode";


export const getLogin = async (login, password) => {
    const {data} = await $host.post('user/login', {login, password})
    
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
}

export const check = async() => {
    const {data} = await $authHost.get('user/check');
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
}

export const getUsers = async() => {
    const {data} = await $authHost.get('user/getUsers');

    return data;
}

export const registerUser = async(candidate) => {
    const message = await $authHost.post('user/register', candidate)

    return message;
}

export const UserToAdmin = async(userId) => {
    const message = await $authHost.post('user/userToAdmin', {id:userId})

    return message;
}

export const DeleteUser = async(userId) => {
    const message = await $authHost.post('user/deleteUser', {id:userId})

    return message;
}