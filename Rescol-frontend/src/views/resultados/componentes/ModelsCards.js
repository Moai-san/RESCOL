// Utilidad React
import { useEffect, useState, useCallback } from 'react';
import '../styles/modelcards.scss'
import { deleteModel, getCropByUser, getModelsByRed } from '../../../services/modelos';
import { Divider, IconButton, Typography, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { useDataContext, useSetDataContext } from "../../providers/DataProvider";

import { useParams,useNavigate, useLocation } from 'react-router-dom';

import { useUserContext } from '../../providers/AccountProvider';
import { useRouteDataContext, useSegmentsContext } from '../../../providers/DataProvider';
import { segmentSlice } from '../../../redux/segmentSlice';

function ModelCards() {
  
  const nuevo = useDataContext()
  const setNew = useSetDataContext()

  const routePrams = useParams()
  const user = useUserContext()

  const [filterData, setFilterData] = useState(null)

  const [auxRouteData, setAuxRoutData] = useState(null)
  const [auxSegmenetData, setAuxSegmentData] = useState(null)

  const [nombre, setNombre] = useState(null)

  const navigate = useNavigate();
  const history = useLocation()


  const getEscenario = useCallback(async() => {
    try{
      const response = await getModelsByRed(user.id, history.state.id).then((response) => response.data)
      setFilterData(response.modelos)
    }catch (err){
      //manejo de errores
    }
    
  }, [])

  //Get Escenario por el usuario
  useEffect(()=>{
    if(history.state && history.state.id){
      getEscenario()
    }else{
      navigate('/planificaciones/')
    }
  },[])
  
  const onDelete = async (id, event, comuna) => {
    event.stopPropagation();
    try{
      const res = await deleteModel(id)
        .then((response) => response.data)
      setNew({...nuevo, [comuna]: nuevo[comuna].filter(item => item !== id)})
      getEscenario()
    } catch (err) {
      //Manejo errores
    }
    
  }

  const getSelectedData = async (id, comuna) => {
    try {
      const response = await getCropByUser(id).then((res) => res.data);
      //console.log(response)
      const item = filterData.find((item) => item.id === id);
      setNombre(item.nombre)
      setAuxRoutData({ ...response.data, data: item });
      setAuxSegmentData(response.segmentos)
      setNew({ ...nuevo, [comuna]: nuevo[comuna].filter(item => item !== id) });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    if(auxRouteData && nombre){
      navigate(`/planificaciones/${routePrams.id}/${nombre}`, 
                {
                  state: {
                          ...history.state, 
                          routeData: auxRouteData,
                          segmentos: auxSegmenetData
                        }
                }
              );
    }
  },[auxRouteData, nombre])

  const formatDia = (n) => {
    if(n === 1) return 'Lunes'
    else if(n === 2) return 'Martes'
    else if(n === 3) return 'Miércoles'
    else if(n === 4) return 'Jueves'
    else if(n === 5) return 'Viernes'
    else if(n === 6) return 'Sábado'
    
  }

  return (
    <div className='card-container'>
      {
         filterData && filterData.map(
          (item) =>
          {
            return(
              <div className='card' key={item.id} onClick={() => getSelectedData(item.id, item.red)}>
        
                <div className='card-header'>
                  <div className='card-title'>
                      <Typography>{item.nombre}</Typography>
                      <div className='card-fecha'>
                        <span>{item.fecha}</span>
                        <span>{item.hora}</span>
                      </div>
                  </div>
                  <IconButton className='button-ct' onClick={(e) => onDelete(item.id,e, item.red)} >
                      <ClearIcon/>
                  </IconButton>
                </div>
                <Divider/>
                <div className='card-content'>
                    <table>
                      <tbody>
                          <tr>
                            <td>Día de recolección:</td>
                            <td align='right'>{formatDia(item.frecuencia)}</td>
                          </tr> 
                          <tr>
                            <td>Costo de transporte ($/km):</td>
                            <td align='right'>{item.costo}</td>
                          </tr>
                          
                          <tr>
                            <td>Generación de residuos (%):</td>
                            <td align='right'>{`${item.residuos>0?'+':''}${item.residuos}%`}</td>
                          </tr>
                          <tr>
                            <td>Jornada laboral (h/d):</td>
                            <td align='right'>{item.jornada}</td>
                          </tr>
                          <tr>
                            <td>Capacidad (t):</td>
                            <td align='right'>{item.capacidad}</td>
                          </tr>
                        </tbody>
                    </table> 
                </div>
              </div>
            )
          }
        )
      }    
    </div>
  )
}

export default ModelCards;
/*
 {nuevo &&  nuevo[item.red].filter(c => c === item.id).length !== 0 && <div className="new_data_model">
                                                                                            <div className="new-data-container">
                                                                                              <span>Nuevo</span>
                                                                                            </div>
                                                                                          </div>}
*/