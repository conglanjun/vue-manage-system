import request from '../utils/request';
import axios from 'axios';
export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};

export const loginRequest = async (user) => {
    const response = await axios.post('/api/login', user)
    console.log(response)
    return response
}

export const fetchUserDataRequest = async () => {
    const response = await axios.get('api/userList')
    console.log(response)
    return response
}
