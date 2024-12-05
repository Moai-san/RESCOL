import { Typography } from "@mui/material"
import "../styles/collabcontainer.scss"
import { useEffect, useState } from "react"
import {Divider} from "@mui/material"
import CollabSensitive from "./CallabSensitive"
import Table from "../../../reutilizables/componentes/Tabla"
import SearchIcon from '@mui/icons-material/Search';

const CollabContainer = ({cardList}) => {

    const [selctedCards, setSelsectedCards] = useState(null)
    const [unSelctedCards, setUnSelsectedCards] = useState(null)
    const [factors, setFactors] = useState(null)

    useEffect(()=>{
        if(cardList){
            const selectedItems = [cardList[0]]
            const unselectedItems = cardList.slice(1)
            setSelsectedCards(selectedItems)
            setUnSelsectedCards(unselectedItems)

        }else{
            setSelsectedCards(null)
            setUnSelsectedCards(null)
            setFactors(null)
        }
    },[cardList])

    const formatInput = (input) => {
        return input.toLocaleString('es').replace(/\./g,' ')
    } 
    
    const makeInfoCard = (item, index) => {
            return(
                <div className={`Individual${index+1}`}>
                        {
                            unSelctedCards.length !== 0 && unSelctedCards.map(item => item.comuna[0].nombre).includes(item.nombre)?
                                unSelctedCards.filter((comuna) => comuna.comuna[0].nombre === item.nombre).map((item, index) => {
                                    const cr = item.costo_real 
                                    const ct = item.c_total
                                    const cs = item.shifts*118750
                                    const cc = item.c_camion*66667
                    
                    
                                    const data = [
                                        {id: 0, text: 'Costo de transporte', value: formatInput(cr - cs - cc)},
                                        {id: 1, text: 'Costo del personal' , value: formatInput(cs)},
                                        {id: 2, text: 'Costo vehículos', value: formatInput(cc)}
                                    ]
                                    return (
    
                                            <div className={`Info-Cards`} style={{width: '350px'}} key={index}>
                                                <div className="info-header">
                                                    <div className="info-header-item">
                                                            <Typography fontWeight={'bold'}> Planificación individual:</Typography>
                                                            {item.comuna[0].nombre}
                                                    </div>
                                                    <div className="info-header-item">
                                                            <Typography fontWeight={'bold'}> Costo total:</Typography>
                                                    </div>
                                                </div>
                                                <div className='info-card-content'style={{color: item.color}}>
                                                        $ {item.costo_real.toLocaleString('es').replace(/\./g,' ')}
                                                    </div>
                                                <div className="info-card-data">
                                                    <Table data={data}/>
                                                </div>
                                            </div>
                                    )
                                })
                            
                            :
                            <div className={`Info-Cards`} style={{width: '350px'}} key={index}>
                            <div className="info-header">
                                <div className="info-header-item">
                                        <Typography fontWeight={'bold'}> Planificación individual:</Typography>
                                        {item.nombre}
                                </div>
                            </div>
                            <div style={{display:'flex', flexDirection:'column',alignItems:'center', height:'100%', justifyContent: 'center' }}>
                                    <SearchIcon fontSize="large"/> 
                                    No se ha encontrado una planificación.
                            </div>
                            </div>
                        }
                    </div>
            )
    }

    return (
       selctedCards && 
        <div className="collab-content">
                {selctedCards[0].comuna.map((item, index) => makeInfoCard(item, index))}
            <div className={`Colaboración`}>
                {selctedCards.map((item, index) => {
                    const cr = item.costo_real 
                    const ct = item.c_total
                    const cs = item.shifts*118750
                    const cc = item.c_camion*66667

                    const data = [
                        {id: 0, text: 'Costo de transporte', value: formatInput(cr - cs - cc)},
                        {id: 1, text: 'Costo del personal' , value: formatInput(cs)},
                        {id: 2, text: 'Costo vehículos', value: formatInput(cc)}
                    ]
                    return (
                        cardList && <>
                        <div className={`Info-Cards`} style={{width:`300px`}} key={`card-${index}`}>
                            <div className="info-header">
                                <div className="info-header-item">
                                        <Typography fontWeight={'bold'}> Planificación Colaborativa</Typography>
                                </div>
                                <div className="info-header-item">
                                        <Typography fontWeight={'bold'}> Costo total en colaboración:</Typography>
                                </div>
                            </div>
                            <div className='info-card-content'style={{color: item.color}}>
                                    $ {item.costo_real.toLocaleString('es').replace(/\./g,' ')}
                            </div>
                            <div className="info-card-data">
                                <Table data={data}/>
                            </div>
                        </div>
                        {index !== cardList.length -1 && <Divider orientation="vertical"></Divider>}
                        </>
                    )
                })} 
                <Divider orientation="vertical"></Divider>
                <div className={`Info-collab-Cards`} style={{width:`${200/3}%`}}>
                    <CollabSensitive selctedCards={selctedCards} unSelctedCards={unSelctedCards} factors={factors} setFactors={setFactors}/>
                </div>
            </div>
            

        </div>
           
    )
}

export default CollabContainer 

/*
unSelctedCards.map((item, index) => {
                const cr = item.costo_real 
                const ct = item.c_total
                const cs = item.shifts*118750
                const cc = item.c_camion*66667


                const data = [
                    {id: 0, text: 'Costo de transporte', value: formatInput(cr - cs - cc)},
                    {id: 1, text: 'Costo del personal' , value: formatInput(cs)},
                    {id: 2, text: 'Costo vehículos', value: formatInput(cc)}
                ]
                return (
                    <div className={`Individual${index+1}`}>
                        <div className={`Info-Cards`} style={{width: '350px'}}>
                            <div className="info-header">
                                <div className="info-header-item">
                                        <Typography fontWeight={'bold'}> Planificación individual:</Typography>
                                        {item.comuna[0].nombre}
                                </div>
                                <div className="info-header-item">
                                        <Typography fontWeight={'bold'}> Costo total:</Typography>
                                </div>
                            </div>
                            <div className='info-card-content'style={{color: item.color}}>
                                    $ {item.costo_real.toLocaleString('es').replace(/\./g,' ')}
                                </div>
                            <div className="info-card-data">
                                <Table data={data}/>
                            </div>
                        </div>
                    </div>
                )
            })
*/