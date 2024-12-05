// Utilidad React
import {  useState, useEffect, useCallback } from 'react';

//CSS
import '../styles/modelcards.scss'

//MUI
import { Divider, Typography} from "@mui/material";
import { useRouteDataContext, useSegmentsContext } from '../../../providers/DataProvider';



//Reducer
import { useDispatch } from 'react-redux';
import { changeId } from '../../../redux/segmentSlice';
import { useParams, useNavigate, useLocation } from 'react-router-dom';



function RouteCards() {

    const history = useLocation()
    const params = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [routeData, setRouteData] = useState(null)


    useEffect(()=>{
        if(history.state && history.state.routeData){
            setRouteData(history.state.routeData)
        } else {
            navigate('/planificaciones/')
            } 
    },[])


    const getSelectedData = (id) => {
        dispatch(changeId({id}))
        navigate(`/planificaciones/${params.id}/${params.es}/${id+1}`, {state: history.state});
    }

    function segundosAFormatoHora(s) {
        var date = new Date(s * 1000); // Multiplicar por 1000 para convertir segundos a milisegundos
        var horas = date.getUTCHours();
        var minutos = date.getUTCMinutes();
        var segundos = date.getUTCSeconds();
    
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }



    
  return (
    <div className="card-container" >
        {
            routeData && routeData.routes.map((route, index) => {
               
                return (
                            <div className={"card"} onClick={()=> getSelectedData(index)} key={index} onMouseEnter={()=>dispatch(changeId({id:index}))} onMouseLeave={()=>{dispatch(changeId({id:-1}))}}> 
                                <div className='card-header'>
                                    <Typography>Ruta S{index+1}</Typography>
                                </div>
                                <Divider/>
                                <div className='card-content'>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td style={{fontWeight:'bold'}}>Calle inicial:</td>
                                            <td >{route[0].calle_i}</td>
                                        </tr>
                                        <tr>
                                            <td style={{fontWeight:'bold'}}>Calle final:</td>
                                            <td >{route.at(-1).calle_i}</td>
                                        </tr> 
                                        <tr>
                                            <td style={{fontWeight:'bold'}}>Tiempo en completar la ruta:</td>
                                            <td>
                                                {segundosAFormatoHora(routeData.propierties.tiempos[index])}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{fontWeight:'bold'}}>Distancia total recorrida:</td>
                                            <td>
                                                {Number(routeData.propierties.distancias[index].toFixed(2)).toLocaleString('es')} km
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{fontWeight:'bold'}}>Costo total:</td>
                                            <td>
                                                ${routeData.propierties.costos[index].toFixed(0)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{fontWeight:'bold'}}>% Utilización del camión:</td>
                                            <td>
                                                {routeData.propierties.utilidad[index].toFixed(0)}%
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        
                                    </table>
                                </div>
                            </div>
                    )
            })
        }
    </div>
    )
}

export default RouteCards;

