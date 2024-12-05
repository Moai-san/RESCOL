import "../styles/colaboración.scss"
import { useEffect, useState } from "react"
import StatsModal from "./StatsModal";
import { Typography } from "@mui/material";
import CollabView from "./CollabView";
import CollabContainer from "./CollabContainer";

const Colaboración = () => {

    //Asiganr modelos
    const [models, setModels] = useState([])

    //Adiganr cartas laterales
    const [cardList, setCardList] = useState(null)


    //Control del modal
    const [modal, setModal] = useState(false)

    //Asignar red id
    const [redId, setRedId] = useState(null)


    return (
        <div className="stats">
            <div className='menu'>
                <Typography fontWeight={'bold'}>ANÁLISIS DE COSTOS EN COLABORACIÓN</Typography>
                <Typography align="justify">Para realizar un análisis de colaboración, es fundamental contar con un escenario colaborativo junto a los escenarios individuales de cada comuna implicada. Sin estos elementos, el escenario colaborativo no se habilitará.</Typography>
                <CollabView setModal={setModal} models={models} cardList={cardList} setCardList={setCardList} setRedId={setRedId}/>
            </div>
            <div className="content">
                <CollabContainer cardList={cardList} setCardList={setCardList}/> 
            </div>
            {modal && <StatsModal setModal={setModal} models={models} setModels={setModels} redId={redId} cardList={cardList} setCardList={setCardList}/>}
        </div>
    )
}

export default Colaboración

