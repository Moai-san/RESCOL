import axios from 'axios';

const mainPath = process.env.REACT_APP_API_MODEL_URL

export const getModelsByUser = (id) => axios.get(`${mainPath}/${id}`);

export const getModelsByRed = (id_usuario, id_red) => axios.get(`${mainPath}/getModelByRed/?id_usuario=${id_usuario}&id_red=${id_red}`)


export const filterModel = (model) => axios.post(`${mainPath}/filterModelByComuna/`, model)

export const getCropByUser = (id) => axios.get(`${mainPath}/getCropByUser/${id}`);

export const postModel = (request) => axios.post(`${mainPath}/`, request)

export const deleteModel = (id) => axios.delete(`${mainPath}/${id}`);
