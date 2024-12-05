import "../styles/statsModal.scss"

import CardItem from "./CardItem";
import ClearIcon from '@mui/icons-material/Clear';
import {IconButton} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import { getModelsByRed } from "../../../services/modelos";
import { useEffect } from "react";
import { useUserContext } from "../../providers/AccountProvider";



const StatsModal = ({setModal,redId, models, setModels, cardList, setCardList}) => {
    
    const colorPallete = [ '#213435', '#46685b', '#648a64', '#a6b985','#e1e3ac']

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
        if(!cardList){
            setCardList([{...item, selected: true, color: colorPallete[0]}])
            setModal(false)
        }
    }

    
    return (
        <div className="stats-modal-card">

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
                <div className="none-modal-view">
                    <><SearchIcon fontSize="large"/> Parece que no se ha encontrado una optimización. Verifique:</>
                    <div style={{display:"flex", flexDirection:'column'}}>
                        <span>&nbsp;</span>
                        <span style={{textAlign:'left'}}>1. Si ha creado el escenario colaborativo.</span>
                        <span style={{textAlign:'left'}}>2. Si cumple las condiciones para habilitarlo.</span>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default StatsModal 
