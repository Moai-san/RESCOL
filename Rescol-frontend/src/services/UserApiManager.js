// apiManager.js
import axios from 'axios';


const mainPath = process.env.REACT_APP_API_USER_URL

export const getUsers = () => axios.get(`${mainPath}/`)

export const identifyUser = (username) => axios.get(`${mainPath}/autenticateUser/${username}`)

export const identifyPassword = (username, password) => axios.get(`${mainPath}/autenticatePassword/${username}/${password}`)

export const postUsers= (request) => axios.post(`${mainPath}/`, request)

export const deleteUser = (id) => axios.delete(`${mainPath}/${id}`)




