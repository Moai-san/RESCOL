import axios from 'axios'

const comunasApi = axios.create({
    baseURL: 'http://localhost:8000/api/comunas'
})



export const getComunas = () => comunasApi.get('/')

export const getById = (id) => comunasApi.get(`/${id}`)

//export const postModel = (request) => modelApi.post('/',request)

//export const deleteModel = (id) => modelApi.delete(`/${id}`)