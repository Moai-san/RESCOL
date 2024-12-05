import "../styles/stats.scss"
import { useEffect, useState } from "react"
import NoCollabView from "./NoCollabViewComparator";
import StatsModal from "./StatsModal";
import { Typography } from "@mui/material";
import NoCollabContainer from "./NoCollaContainer";

const Stats = () => {

    //Asiganr modelos
    const [models, setModels] = useState(null)

    //Adiganr cartas laterales
    const [cardList, setCardList] = useState([])

    //Control de opciones dropdown
    const [option, setOption] = useState(null)

    //Control del modal
    const [modal, setModal] = useState(false)

    //Asignar red id
    const [redId, setRedId] = useState(null)

    //Asignar tipo de vidta
    const [enableCollabView, setEnableCollabView] = useState(true)  



    useEffect(()=>{

        if(option){
            setCardList([])
            setModels([])
            if(option.type ==='comunas'){
            }else if(option.type === 'main'){
                if(option.id === 0){
                    setEnableCollabView(false)
                }else{
                    setEnableCollabView(true)
                }
            }
        }
    },[option])

    return (
        <div className="stats">
            <div className='menu'>
                <Typography fontWeight={'bold'}>ANÁLISIS DE ESCENARIOS</Typography>
                <Typography>Agregar escenario:</Typography>
                <NoCollabView setModal={setModal} setModels={setModels} cardList={cardList} setCardList={setCardList} models={models} setRedId={setRedId}/>
            </div>
            <div className="content">
                <NoCollabContainer cardList={cardList} setCardList={setCardList}/>
            </div>
            {modal && <StatsModal setModal={setModal} models={models} setModels={setModels} redId={redId} cardList={cardList} setCardList={setCardList}/>}
        </div>
    )
}

export default Stats
