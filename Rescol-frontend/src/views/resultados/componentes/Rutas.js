import { useEffect, useState, useRef } from 'react';

import { Divider, IconButton, Typography, Tooltip } from '@mui/material';

import RouteInfo from './RouteInfo';

import LinearProgress from '@mui/material/LinearProgress';

//ICONS
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import '../styles/routedetails.scss'

import { useSelector, useDispatch } from 'react-redux';
import { changeSection } from '../../../redux/sectionSlice';
import { useNavigate, useLocation } from 'react-router-dom';

import { PDFDownloadLink } from '@react-pdf/renderer';
import PDF from './PdfMaker';

const DetalleDeRutas = ( ) => {

    const navigate = useNavigate()
    const history = useLocation()
    
    const [data, setData] = useState(null)
    const [progress, setProgress] = useState(0)
    const [calles, setCalles] = useState([])

    const [route, setRoute] = useState(null)

    const [basura, setBasura] = useState(0)

    const segmentId = useSelector((state) => state.segmentId.id)
    const [routeInfo, setRouteInfo] = useState(null)
    const [propierties, setPropierties] = useState(null)
    const [idHover, setIdHover] = useState(0);
    const [costo, setCosto] = useState(null)
    

    const dispatch = useDispatch()

    useEffect(()=>{
      try{
        setRouteInfo(history.state.routeData.routes[segmentId])
        setPropierties(history.state.routeData.propierties)
        setCosto(history.state.routeData.propierties.costo)
      }catch (err){
        navigate(`/planificaciones/`);
      }
    },[])



    useEffect(() => {
      if (routeInfo) {
        setRoute(routeInfo[0]);
        setData([routeInfo[0]])
        dispatch(changeSection({id: routeInfo[0].id}))
      }
    }, [routeInfo,setRoute]);

    const [horaPost, setHoraPost] = useState(0)

    const nextStep = () => {
      if (idHover < routeInfo.length - 1) {
        const nextId = idHover + 1;
        setIdHover(nextId);
        dispatch(changeSection({id: nextId}))
        setData([routeInfo[nextId]]);
        setRoute(routeInfo[nextId])
        setHoraPost(horaPost+routeInfo[idHover].tiempo)
        if(routeInfo[nextId].giro){
          setCalles([routeInfo[nextId-1].calle_f,routeInfo[nextId+1].calle_i])
        }else{
          setCalles([routeInfo[nextId].calle_i,routeInfo[nextId].calle_f])
        }
        setProgress(Math.ceil(nextId*100/routeInfo.length))
        setCosto(costo + propierties.costo*Number.parseFloat(routeInfo[nextId].distancia).toFixed(2))
        const b = routeInfo[nextId].basura
        if(b) setBasura(basura+Number(routeInfo[nextId].basura))
      }
    };
  
    const prevStep = () => {
      if (idHover > 0) {
        const prevId = idHover - 1;
        setIdHover(prevId);
        dispatch(changeSection({id: prevId}))
        setData([routeInfo[prevId]]);
        setRoute(routeInfo[prevId])
        setHoraPost(horaPost-routeInfo[prevId].tiempo)
        if(routeInfo[prevId].giro){
          setCalles([routeInfo[prevId-1].calle_f,routeInfo[prevId+1].calle_i])
        }else{
          setCalles([routeInfo[prevId].calle_i,routeInfo[prevId].calle_f])
        }
        const b = routeInfo[idHover].basura
        setProgress(Math.ceil(prevId*100/routeInfo.length))
        setCosto(costo - propierties.costo*Number.parseFloat(routeInfo[prevId].distancia).toFixed(2))
        if(b) setBasura(Math.abs(basura-Number(routeInfo[prevId].basura)))
        setProgress(Math.ceil(prevId*100/routeInfo.length))
      }
    };
  


    //Determinar giros
    // Definir un objeto que mapea las direcciones cardinales a valores numéricos para facilitar el cálculo
    const direcciones = {
        'norte': 0,
        'este': 1,
        'sur': 2,
        'oeste': 3
    };

    // Función para determinar la dirección de giro
    function determinarGiro(direccionActual, nuevaDireccion) {
      // Calcular la diferencia entre las direcciones actual y nueva
      const diferencia = (direcciones[nuevaDireccion] - direcciones[direccionActual] + 4) % 4;
      
      // Determinar el tipo de giro
      if (diferencia === 1) {
        return 'derecha';
      } else if (diferencia === 2) {
        return 'media vuelta';
      } else {
        return 'izquierda';
      }
    }

    const determinarIcon = (sentido, giro) => {
      if(!giro){
        if(sentido === 'norte') return <NorthIcon/>
        else if(sentido === 'sur') return <SouthIcon/>
        else if(sentido === 'este') return <EastIcon/>
        else if(sentido === 'oeste') return <WestIcon/>
        else if(sentido === 'derecha') return <TurnRightIcon/>
        else if(sentido === 'izquierda') return <TurnLeftIcon/>
      }
    }

    const writeInstruct = (data) => {
      const calle_i = data.calle_i.toLowerCase().split(' ').map(element => {
        return element.charAt(0).toUpperCase() + element.slice(1);
      }).join(' ');

      

      if(!data.giro){
        const icon = determinarIcon(data.sentido.toLowerCase())
        const calle_f = data.calle_f.toLowerCase().split(' ').map(element => {
          return element.charAt(0).toUpperCase() + element.slice(1);
        }).join(' ');

        return <>{icon} Dirígete al {data.sentido} por {calle_i} en dirección a {calle_f}</>
      }
      if(routeInfo[data.id-1] && routeInfo[data.id+1]){

        if(routeInfo[data.id-1].sentido !== routeInfo[data.id+1].sentido){
          const s = determinarGiro(routeInfo[data.id-1].sentido.toLowerCase(), routeInfo[data.id+1].sentido.toLowerCase())
          const icon = determinarIcon(s)
          return <>{icon} Gira hacia la {s} en {calle_i}.</>
        }else{
          const icon = determinarIcon(routeInfo[data.id-1].sentido.toLowerCase())
          return <>{icon} Continúa por {calle_i}</>
        }
      }
    }

    

    // Función para sumar minutos a una hora inicial y devolver la hora final en formato hh:mm:ss
    function segundosAFormatoHora(s) {
      var date = new Date(s * 1000); // Multiplicar por 1000 para convertir segundos a milisegundos
      var horas = date.getUTCHours();
      var minutos = date.getUTCMinutes();
      var segundos = date.getUTCSeconds();
  
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }

  const establecerHora = (s) => {
    return segundosAFormatoHora(horaPost + s)
  }


  const [pdfLoad, setPDFload] = useState(true);
  
  const makePdf = async () => {
    setPDFload(!pdfLoad)
}

    return (
        <div className="route-details-container">
          <div className='route-details-detalle-container'>
            <div className='info-route-header'>
              <Typography fontWeight='bold'>DETALLE</Typography>
              {pdfLoad?
                  <Tooltip title="Generar PDF">
                    <IconButton onClick={ makePdf}>
                      <PictureAsPdfIcon/>
                    </IconButton>
                  </Tooltip>
                    :
                  <PDFDownloadLink document={<PDF routeInfo={routeInfo} />} fileName='test.pdf'>
                    {({ blob, url, loading, error }) => (
                      <IconButton disabled={loading} onClick={(e) =>  e.stopPropagation()}>
                          {loading ? <div className='spin-loader'></div> : <DownloadIcon />}
                        </IconButton>
                    )}
                  </PDFDownloadLink>  
                }
            </div>
            <div className='info-route-detail'>
              <div className='from-info'>
                <span className='span-info-title'>DESDE:</span>
                <span>{data && !data[0].giro ? data[0].calle_i: calles[0]}</span>
                <div className='span-info-time'>{data &&  segundosAFormatoHora(horaPost)}</div>
              </div>
              <div className='from-info'>
                <span className='span-info-title'>HASTA:</span>
                <span>{data && !data[0].giro ? data[0].calle_f: calles[1]}</span>
                <div className='span-info-time'>{ data && establecerHora(data[0].tiempo)}</div>
              </div>
            </div>
          </div>
          <div className='route-details-instrucción-container'>
            <Divider/>
            {data &&
              data.map((item) => (
                <Typography variant="body1"
                  id={`route-span-${item.id}`}
                  className={'route-span'}
                  key={item.id}
                >
                  {writeInstruct(item)}
                </Typography>
              ))}
          </div>

          <div className='route-details-info-container'>
            <Divider/>
            {data && <RouteInfo routeData={data[0]} basura={basura}/>}
          </div>

          <div className='route-details-playbox-container'> 
            {
            routeInfo &&<div className="route-details-play-box">
             <IconButton onClick={prevStep} disabled={idHover === 0}><SkipPreviousIcon/></IconButton>
              {`${idHover}/${routeInfo.length -1}`}
              <IconButton onClick={nextStep} disabled={idHover === routeInfo.length-1}><SkipNextIcon/></IconButton>
              </div>
            }
            <LinearProgress variant="determinate" value={progress}/>
          </div>
        </div>
    );
  };
  
  export default DetalleDeRutas;
  
