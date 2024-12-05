import DropDownMenu from "./DropDownMenu"
import { useEffect, useState } from "react"
import { getChartsData } from "../../../services/charts"
import { Typography } from "@mui/material"
import ErrorCardItem from "./ErrorCardItem"

const CollabSensitive = ({selctedCards, unSelctedCards, factors, setFactors}) => {

   
    const [option, setOption] = useState({id: 3})
    const [pieData, setPieData] = useState(null)

    const colors = ['#0098b1', '#8661a1']

    useEffect(()=>{
        const chargeFactors = async () => {
                const unObj = unSelctedCards.map(item => {return {label: item.comuna[0].nombre ,costo: item.costo_real, distancia: item.c_km}})
                const slObj = selctedCards.map(item => {return {label: 'colaboración' ,costo: item.costo_real, distancia: item.c_km}})
                const obj = unObj.concat(slObj)
                try{
                    const res = await getChartsData({id: option.id, data: obj})
                    setFactors(res.data.performance)
                } catch (err){
                    //manejo de errorres
                } 
                
        }

        selctedCards.length !==0 && unSelctedCards.length === selctedCards[0].comuna.length  && chargeFactors()

    },[selctedCards, unSelctedCards, option, setFactors])



    useEffect(()=>{
        if(factors){
            const A = factors[0].values.map((item,index) => 
                {
                    return(
                        {
                            id: index, 
                            value: item, 
                            color: colors[index],
                            label: factors[0].labels[index]
                        }
                    )
                }
            )
            setPieData(A)
        }
    },[factors, selctedCards, unSelctedCards])



    return (
            <div className="sensitive-content">
                <Typography fontWeight={'bold'}> Distribuir costo total en colaboración entre comunas </Typography>
                <DropDownMenu type='factors' option={option} setOption={setOption}/>
                <div className="info-sensitive">
                        {pieData ? pieData.map((item,index) =>{
                            const ahorro = (unSelctedCards[index].costo_real -item.value)
                            const percent= (ahorro*100/unSelctedCards[index].costo_real).toFixed(2).toLocaleString('es').replace('.',',')
                            return(
                                <div className="box"> 
                                    <div className="Title"> 
                                        <Typography noWrap={true}>Costo asignado a</Typography>
                                        <Typography fontWeight={'bold'}>{item.label}</Typography>
                                    </div>
                                    
                                    <div className="Value" style={{color: item.color}}>
                                        $ {item.value.toLocaleString('es').replace(/\./g,' ')}
                                    </div>
                                    <div className="Antes">
                                        <Typography>(Ahorro)</Typography>
                                        <Typography fontWeight={'bold'}>$ {ahorro.toLocaleString('es').replace(/\./g,' ')}</Typography>
                                    </div>
                                    <div className="Ahorro">
                                        <Typography>(%)</Typography>
                                        <Typography fontWeight={'bold'}>{percent}</Typography>
                                    </div>
                                </div>
                            )

                        }):
                        <ErrorCardItem sc={selctedCards[0].comuna.map(item => item.nombre)}
                                       usc={unSelctedCards.map(item => item.comuna[0].nombre)}/>
                    }
                        
                </div>
            </div>
    )
}

export default CollabSensitive 
//{factors && <PieColor factors={factors.slice(1)} cards={unSelctedCards}/>}