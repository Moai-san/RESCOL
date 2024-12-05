import axios from 'axios'

const modelApi = axios.create({
    baseURL: process.env.REACT_APP_API_TOOLS_URL
})

export const getBufferedArea = (request) => modelApi.post('bufferArea/',request)

