//React
import { useEffect, useState, useRef } from "react";
import uuid from 'react-uuid';

//MUI


//CSS & ESTILOS 
import "../styles/loadingUploadCrop.scss"

//COMPONENTES


//API
import { postModel } from '../../../services/modelos';

//Contextos
import { useUserContext } from '../../providers/AccountProvider';
import { useDataContext, useSetDataContext} from "../../providers/DataProvider";
import { Button,  } from "@mui/material";
import { ErrorManager } from "../../../services/ErrorManager";


function OptimizeButton({lineData, parametres, projectName, openLoading, disableEditName, disableButton, setAlertData}) {


    //Prepara request
        
    const user = useUserContext()

    const nuevo = useDataContext()
    const setNew =  useSetDataContext()
    
    const createModel =  () => {
        openLoading(true)

        // Obtener la fecha actual en UTC
        let fechaUTC = new Date();
        let fechaChile = new Date(fechaUTC.getTime());
       
        // Obtener el día, mes y año de la fecha
        let dia = fechaChile.getDate();
        let mes = fechaChile.getMonth() + 1; // Meses en JavaScript son zero-based, por lo que sumamos 1
        let año = fechaChile.getFullYear();
    
        // Obtener la hora, minutos y segundos de la hora
        let horas = fechaChile.getHours();
        let minutos = fechaChile.getMinutes();
        let segundos = fechaChile.getSeconds();
    
        // Formatear los componentes en el formato "HH:MM:SS"
        let horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
       
        // Formatear los componentes en el formato "dd/mm/aa"
        let fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año.toString().slice(-2)}`;
    
        const crop_id = uuid()

        console.log(parametres.frecuencia)

        const request = {
                data_id   : crop_id,
                nombre    : projectName,
                residuos  : parametres.residuos,
                costo     : parametres.costo,
                capacidad : parametres.capacidad,
                jornada   : parametres.jornada,
                frecuencia: parametres.frecuencia,
                fecha     : fechaFormateada,
                hora      : horaFormateada,
                user_id   : user.id,
                red_id    : lineData.id,
                data      : JSON.stringify(lineData.data)
        }
        
        optimize(request)
    }


    //Logica de subida del modelo
    const optimize = async (request, crop_id) => {
        try{
            const response = await postModel(request)
            console.log(response)
            setAlertData(response.data)
            if(nuevo && nuevo[lineData.id]){
                nuevo[lineData.id].push(crop_id)
                setNew(nuevo)
            }else(
                setNew({...nuevo, [lineData.id]: [crop_id]})
            )
        } catch (err) {
            setAlertData(ErrorManager(err.response.data.code))
        }
        openLoading(false)
        
    }




    return (
        <Button variant="contained" onClick={createModel} disabled={disableEditName || disableButton}>Optimizar</Button>
    );
}

export default OptimizeButton

/*

    const setAlert = useSetAlertDataContext()

    //Handle Crop 
    useEffect(() => {
        const cropArea = async () => {
            try{
                await uploadCrop(lineData.data)
            }catch(err){
                ErrorManager(err.code)
            }
        }
        cropArea()
    },[])


    
    //Upload Areas
    const user = useUserContext()

    const nuevo = useDataContext()
    const setNew =  useSetDataContext()

    const uploadCrop = async (data) => {
        // Obtener la fecha actual en UTC
        let fechaUTC = new Date();
   

        let fechaChile = new Date(fechaUTC.getTime());
   
        // Obtener el día, mes y año de la fecha
        let dia = fechaChile.getDate();
        let mes = fechaChile.getMonth() + 1; // Meses en JavaScript son zero-based, por lo que sumamos 1
        let año = fechaChile.getFullYear();

        // Obtener la hora, minutos y segundos de la hora
        let horas = fechaChile.getHours();
        let minutos = fechaChile.getMinutes();
        let segundos = fechaChile.getSeconds();

        // Formatear los componentes en el formato "HH:MM:SS"
        let horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
   
        // Formatear los componentes en el formato "dd/mm/aa"
        let fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año.toString().slice(-2)}`;

        const crop_id = uuid()
        const request = {
            data_id   : crop_id,
            nombre    : projectName,
            residuos  : parametres.residuos,
            costo     : parametres.costo,
            capacidad : parametres.capacidad,
            jornada   : parametres.jornada,
            frecuencia: parametres.frecuencia,
            fecha     : fechaFormateada,
            hora      : horaFormateada,
            user_id   : user.id,
            red_id    : lineData.id,
            data      : JSON.stringify(data)
        }
        try{
            const response = await postModel(request)
            console.log(response)
            setAlert(response.data)
            if(nuevo && nuevo[lineData.id]){
                nuevo[lineData.id].push(crop_id)
                setNew(nuevo)
            }else(
                setNew({...nuevo, [lineData.id]: [crop_id]})
            )
            setOpenProgress(false)
            return true
        }catch(err){
            setAlertData(ErrorManager(err.code))
            setOpenProgress(false)
            return false
        }
    }
*/