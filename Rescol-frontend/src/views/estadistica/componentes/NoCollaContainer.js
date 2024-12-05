import "../styles/nocollabcontainer.scss"
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { Icon, Typography, Tooltip } from '@mui/material';
import { useEffect, useState } from "react";
import NoCollabBarChart from "./NoCollabBarChart";
import NoCollabTable from "./NoCollabTable";



const NoCollabContainer = ({cardList, setCardList}) => {


    const [auxCardList, setAuxCardlist] = useState(null) 
    const [selctedCards, setSelsectedCards] = useState(null)
    const [unSelctedCards, setUnSelsectedCards] = useState(null)
    

    useEffect(()=>{
        if(cardList.length !== 0){
            const selectedItems = cardList.filter(item => item.selected === true);
            const unselectedItems = cardList.filter(item => item.selected === false);
            const reorderedList = [...selectedItems, ...unselectedItems];
            setAuxCardlist(reorderedList)
            setSelsectedCards(selectedItems)
            setUnSelsectedCards(unselectedItems)
        }else{
            setAuxCardlist(null)
        }
    },[cardList])

    const formatDia = (n) => {
        if(n === 1) return 'Lunes'
        else if(n === 2) return 'Martes'
        else if(n === 3) return 'Miércoles'
        else if(n === 4) return 'Jueves'
        else if(n === 5) return 'Viernes'
        else if(n === 6) return 'Sábado'
        
}

    return (
        auxCardList && <div className="no-collab-content">
                    {selctedCards.map(
                            item => {
                                return<div className="Header" key={item.id}>
                                        <div className="header-item" ><Typography fontWeight={'bold'}>Planificación:</Typography> <div style={{color:item.color}}>{item.nombre}</div></div>
                                        <div className="header-item"><Typography fontWeight={'bold'}>Comunas:</Typography> {item.comuna.map((i,index )=> (
                                            <div key={i.id}>{i.nombre} {index !== item.comuna.length -1 && ','}</div>))} 
                                        </div>
                                        <div className="header-item"><Typography fontWeight={'bold'}>Día de recolección:</Typography>{formatDia(item.frecuencia)}</div>
                                      </div>
                                }
                            )
                    }
                    <div className="Costos"> 
                        <Typography fontWeight={'bold'}>Costo de transporte</Typography>
                        {auxCardList.map((item, index) => {
                                        let value;
                                        if(auxCardList[0].c_total > item.c_total){
                                            value = <Icon sx={{ color: '#0C63E7' }}> <ArrowDropDownIcon/></Icon>
                                        }else if(auxCardList[0].c_total < item.c_total){
                                            value = <Icon sx={{ color: '#FF0000' }}><ArrowDropUpIcon/> </Icon>
                                        }else{
                                            value = <Icon sx={{ color: '#C5C6C7' }}><RemoveIcon/> </Icon>
                                        }
                                        return(
                                            <div key={item.id} className={`costo-item ${index === 0 ? 'first-item' : 'normal-item'}`}>
                                                 <Tooltip title={<Typography>{item.nombre}</Typography>} placement="left"><div style={{color: item.color}}>$ {item.c_total.toLocaleString('es').replace(/\./g,' ')}</div></Tooltip>
                                                {index !==0 && value}
                                            </div>
                                      )
                        })}
                    </div>
                <div className="Grafico"> 
                        <Typography  variant="h7" >Comparación de costo de transporte respecto a: <div style={{color:selctedCards[0].color}}>{selctedCards[0].nombre}</div></Typography>
                        <NoCollabBarChart type='noCo' factors="true" selctedCards={selctedCards} unSelctedCards={unSelctedCards}/>
                </div>
                <div className="Tabla">
                    <div className="table-container">  
                        <NoCollabTable data={auxCardList}
                                       cardList={cardList} 
                                       setCardList={setCardList}
                                       selctedCards={selctedCards}
                                       unSelctedCards={unSelctedCards}/>
                    </div>
                </div>
            </div>
    )
}

export default NoCollabContainer 