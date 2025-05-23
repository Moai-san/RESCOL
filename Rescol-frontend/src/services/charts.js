import axios from 'axios'

const modelApi = axios.create({
    baseURL: REACT_APP_API_TOOLS_URL
})

export const getChartsData = (obj) => modelApi.post('/procesarCostos/', obj)
