import axios from 'axios';

const comunasApi = axios.create({
    baseURL: process.env.REACT_APP_API_COMUNAS_URL
})



export const getComunas = () => comunasApi.get('/')

export const getById = (id) => comunasApi.get(`/${id}`)

//export const postModel = (request) => modelApi.post('/',request)

//export const deleteModel = (id) => modelApi.delete(`/${id}`)