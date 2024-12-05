// Utilidad React

import { useEffect, useState } from "react";
import { getModelsByRed } from "../../../services/redesViales";
import { Typography } from "@mui/material";
import { useDataContext } from "../../providers/DataProvider";
import { useUserContext } from "../../providers/AccountProvider";
import { useNavigate } from 'react-router-dom';
import {ErrorManager} from '../../../services/ErrorManager'
import AlertNotification from '../../main/componentes/Alert'



function ListarRedes() {

    const [redes, setRedes] = useState([]); 

    const nuevo = useDataContext()

    //User Data
    const user = useUserContext()

    const [alertData, setAlertData] = useState(null)

    useEffect(() => {
        const fetchRedes = async () => {
            try{
                const response = await getModelsByRed(user.id).then((res) => res.data)
                setRedes(response)
            }catch (error){
                setAlertData(ErrorManager(error.code))
            }
        }
        fetchRedes()
    },[])


    const navigate = useNavigate();

    const handleSelect = (id, nombre) => {
        navigate(`/planificaciones/${nombre}`, {state: {id: id}})
      };

    return (
        <div className='card-container'>
        <AlertNotification alertData={alertData} setAlertData={setAlertData}/>
        {
            redes.map((item) => 
                {
                    return <div className='card' key={item.id} onClick={() => handleSelect(item.id, item.nombre)}>
                                <div className='card-header'>
                                    <div style={{width:'100%'}}> 
                                    <Typography>{item.nombre}</Typography>
                                        <div style={{display:"flex", width:"100%", justifyContent: "space-between"}}>
                                            <span>Número de planificaciones</span>
                                            <span>{item.modelos}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                }
            )
        }
        </div>
    );
}

export default ListarRedes;

/* {nuevo && nuevo[item.id] && nuevo[item.id].length !==0 && <div className="new_data">{nuevo[item.id].length}</div>} */