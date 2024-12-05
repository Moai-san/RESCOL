// Utilidad React
import { useEffect, useState } from 'react';

//CSS
import "../styles/routeinfo.scss"

//MUI
import { Typography, Divider} from "@mui/material";
import SquareFill from './Borrar';

//COMPONENTES 




function RouteInfo({routeData}) {

    const [activate, setActivate] = useState(true)
    const [time, setTime] = useState(null)

    const activateInfo = () =>{
        setActivate(!activate)
    }

    return(
        <div className={`info-box`} onClick={activateInfo}>
                <div className='info-details'>
                    <div className='info-header-title'>
                        <Typography fontWeight='bold'>
                            INDICADORES
                        </Typography>
                    </div>
                    <div className='info-route-percentage'>
                        <Typography className='span-percentaje-title'>CAPACIDAD UTILIZADA:</Typography>
                        <SquareFill percentage={routeData.basura_ac/100}/>
                    </div>
                    <div className='info-route-detail'>
                        <div className='from-info'>
                            <span className='span-info-title'>TIEMPO DEL TRAMO:</span>
                            <span>{Number.parseFloat(routeData.tiempo.toFixed(2)).toLocaleString('es')} s</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>TIEMPO ACUMULADO:</span>
                            <span>{Number.parseFloat(routeData.tiempo_ac.toFixed(2)).toLocaleString('es')} s</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>RESIDUOS DEL TRAMO:</span>
                            <span>{ routeData.basura? Number.parseFloat(routeData.basura.toFixed(2)).toLocaleString('es') : 0} kg</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>RESIDUOS ACUMULADOS:</span>
                            <span>{Number.parseFloat(routeData.basura_ac.toFixed(2)).toLocaleString('es')} kg</span>
                        </div>
                        
                        <div className='from-info'>
                            <span className='span-info-title'>DISTANCIA DEL TRAMO:</span>
                            <span>{Number.parseFloat(routeData.distancia.toFixed(2)).toLocaleString('es')} m</span>
                        </div>
                        
                        <div className='from-info'>
                            <span className='span-info-title'>DISTANCIA ACUMULADA:</span>
                            <span>{Number.parseFloat(routeData.distancia_ac.toFixed(2)).toLocaleString('es')} m</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>COSTO DEL TRAMO:</span>
                            <span>$ {Number.parseFloat((routeData.distancia*760/1000).toFixed(2)).toLocaleString('es')}</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>COSTO ACUMULADO:</span>
                            <span>$ {Number.parseFloat(routeData.coste_ac.toFixed(2)).toLocaleString('es')}</span>
                        </div>
                    </div>
                </div>
                
            </div>
  )
}

export default RouteInfo;

/*
<di>
                    <div className='info-header-title'>
                        <Typography fontWeight='bold'>
                            INDICADORES
                        </Typography>
                    </div>
                    <div className='info-route-percentage'>
                        <span className='span-percentaje-title'>PORCENTAJE DE UTILIZACIÓN:</span>
                        <SquareFill percentage={routeData.basura_ac/100}/>
                    </div>
                    <div className='info-route-detail'>
                        <div className='from-info'>
                            <span className='span-info-title'>TIEMPO DEL TRAMO:</span>
                            <span>{Number.parseFloat(routeData.tiempo.toFixed(2)).toLocaleString('es')} s</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>TIEMPO TRANSCURRIDO RECORRIDO:</span>
                            <span>{Number.parseFloat(routeData.tiempo_ac.toFixed(2)).toLocaleString('es')} s</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>RESIDUOS DEL TRAMO:</span>
                            <span>{ routeData.basura? Number.parseFloat(routeData.basura.toFixed(2)).toLocaleString('es') : 0} kg</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>RESIDUOS ACUMULADOS:</span>
                            <span>{Number.parseFloat(routeData.basura_ac.toFixed(2)).toLocaleString('es')} kg</span>
                        </div>
                        
                        <div className='from-info'>
                            <span className='span-info-title'>DISTANCIA RECORRIDA:</span>
                            <span>{Number.parseFloat(routeData.distancia.toFixed(2)).toLocaleString('es')} m</span>
                        </div>
                        
                        <div className='from-info'>
                            <span className='span-info-title'>DISTANCIA ACUMULADA:</span>
                            <span>{Number.parseFloat(routeData.distancia.toFixed(2)).toLocaleString('es')}</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>COSTO DEL TRAMO:</span>
                            <span>$ {Number.parseFloat((routeData.distancia*760/1000).toFixed(2)).toLocaleString('es')}</span>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>COSTO ACUMULADO:</span>
                            <span>$ {Number.parseFloat(routeData.coste_ac.toFixed(2)).toLocaleString('es')}</span>
                        </div>
                    </div>
                </di>
*/

/*
<div className='info-details'>
                    <div className='info-header-title'>
                        <Typography fontWeight='bold'>
                            DETALLE
                        </Typography>
                    </div>
                    <div className='info-route-detail'>
                        <div className='from-info'>
                            <span className='span-info-title'>DESDE:</span>
                            <span>{!routeData.giro ? routeData.calle_i: calles[0]}</span>
                            <div className='span-info-time'>{time}</div>
                        </div>
                        <div className='from-info'>
                            <span className='span-info-title'>HASTA:</span>
                            <span>{!routeData.giro ? routeData.calle_f: calles[1]}</span>
                            <div className='span-info-time'>{ hora}</div>
                        </div>
                    </div>
                </div>  
*/