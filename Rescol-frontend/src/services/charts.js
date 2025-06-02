import axios from 'axios';

const modelApi = axios.create({
    baseURL: process.env.REACT_APP_API_TOOLS_URL
//    baseURL: 'http://localhost:8000/api/'
})

export const getChartsData = (obj) => modelApi.post('/procesarCostos/', obj)
