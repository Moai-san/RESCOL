import "../styles/statsModal.scss"

import CardItem from "./CardItem";
import ClearIcon from '@mui/icons-material/Clear';
import {IconButton} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import { getModelsByRed } from "../../../services/modelos";
import { useEffect, useState } from "react";
import { useUserContext } from "../../providers/AccountProvider";

import AlertNotification from "../../main/componentes/Alert";



const StatsModal = ({setModal,redId, models, setModels, cardList, setCardList}) => {
    
    const colorPallete = ['#46685b', '#648a64', '#8ba78b', '#a6b985','#e1e3ac']

    const [alertData, setAlertData] = useState(null)

    const user = useUserContext()


    useEffect(()=>{
        const getModels = async() => {
            try{
                const res = await getModelsByRed(user.id, redId).then(res => res.data.modelos)
                setModels(res)
            } catch (err){
                //Manejo de errores
            }
        }

        if(models && models.length === 0){
            getModels()
        }

    },[])


    const addCardData = (item) => {
        if(cardList.length < 5){
            let value=false
            if(cardList.length === 0){
                value = true
            }

            const usedColors = cardList.map(item => {return item.color})

            // Filtrar los colores que no están en usedColor
            const remainingColors = colorPallete.filter(color => !usedColors.includes(color));

            
            setCardList([...cardList, {...item, selected: value, color: colorPallete[cardList.length]}])
            setModal(false)
        }
        else{
            setAlertData({title: 'ERROR', type: 'error', text:'Se ha alcanzado la capacidad máxima de planificaciones'})
        }
    }

    
    return (
        <div className="stats-modal-card">
             {alertData && <AlertNotification alertData={alertData} setAlertData={setAlertData}/>}
            <div className='modal-close-icon'><IconButton sx={{color:'grey'}} onClick={()=>setModal(false)}><ClearIcon/></IconButton></div>        
            <div className="modal-content">
                {models && models.length !==0?
                <div className="modal-cards-container">
                    {models.map((item) => 
                        {
                            return(
                                <div  key={item.id} style={{cursor:'pointer'}} 
                                      onClick={() => addCardData(item)}>
                                        <CardItem type="model" item={item} showDelete={false}/>
                                </div>)
                            })
                        }
                    
                </div>:
                <div className="none-modal-view"><SearchIcon fontSize="large"/> Parece que no se ha encontrado una optimización. </div>}
            </div>
        </div>
    )
}

export default StatsModal 
