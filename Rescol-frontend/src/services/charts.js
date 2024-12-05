import axios from 'axios'

const modelApi = axios.create({
    baseURL: 'http://localhost:8000/api/'
})

export const getChartsData = (obj) => modelApi.post('procesarCostos/', obj)
