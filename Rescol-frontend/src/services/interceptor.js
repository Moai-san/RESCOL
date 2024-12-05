import axios from "axios"
import { ErrorManager } from "./ErrorManager";

export const AxiosInterceptor = () => {


    axios.interceptors.request.use(
        (request) => {
            //console.log("Se ha hecho una petición:", request )
            return request
        }
    );

    axios.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            console.log(error.code)
            return Promise.reject(error);
        }
    );
}