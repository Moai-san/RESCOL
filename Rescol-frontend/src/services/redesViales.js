import axios from 'axios'

const mainPath = process.env.REACT_APP_API_REDES_URL

export const getRed = (id) => axios.get(`${mainPath}/?user_id=${id}`)

export const getInstance = (id) => axios.get(`${mainPath}/${id}`)

export const postRed= (request) => axios.post(`${mainPath}/`, request)

export const deleteRed = (id) => axios.delete(`${mainPath}/${id}`)

export const updateRed = (id, request) => axios.put(`${mainPath}/${id}/`, request)

export const getSegments = (id) => axios.get(`${mainPath}/getSegmentMap/?id=${id}`)

export const getModelsByRed =  (id) =>  axios.get(`${mainPath}/getModelsByRed/?id=${id}`)