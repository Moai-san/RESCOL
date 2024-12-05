//React
import { useState, useEffect, useRef } from 'react';

//MUI
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Divider } from '@mui/material';

import { getRed, getInstance } from '../../../services/redesViales';
import { ErrorManager } from '../../../services/ErrorManager'; 

//CSS & ESTILOS 
import '../styles/dropdownmenu.scss'
import AlertNotification from '../../main/componentes/Alert';

//Componentes

const DropDownMenu = ({lineData,setShowUploadComponent, setLineData, setDisabled}) => {

    const [activate, setActivate] = useState(false)
    const [title, setTitle] = useState('Escoge una comuna')
    const [comunas, setComunas] = useState([])
    const [alertData, setAlertData] = useState(null)

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActivate(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [dropdownRef]);


    useEffect(()=>{
        if(lineData) setTitle(lineData.nombre)
    },[lineData])
    

    const fetchData = async () => {
        try {
            const res =  await getRed()
                .then((response) => response.data)
            setComunas(res)
        } catch (error) {
            //Manejo de errores
            setAlertData(ErrorManager(error.code))
        }
    }
    

    const activateDropMenu = () => {
        setActivate(!activate)
        fetchData()
    }

    const getJsonData = async (nombre, id) => {
        setTitle(nombre)
        setActivate(false)
        setShowUploadComponent(false)
        setLineData(null)

        try {
            const res = await getInstance(id)
            res.data.nombre = nombre
            res.data.id = id
            setLineData(res.data)
            setDisabled(false)
        } catch (error) {
            //Manejo de errores
            setAlertData(ErrorManager(error.code))
        }
    }

    return (
        <div  className="dropdown" ref={dropdownRef}>
            {alertData && <AlertNotification alertData={alertData} setAlertData={setAlertData}/>}
            <div   className={`dropdown-title-content ${activate? 'dropdown-activate': ''}`} onClick={activateDropMenu}>
                <span>{title}</span> {activate? <ArrowDropUpIcon/>:<ArrowDropDownIcon/>}
            </div>

            {activate && 
                <div className="dropdown-content">
                    <div className="triangulo"></div>
                    <div className='dropdown-item-tittle'>
                        REGIÓN METROPOLITANA
                    </div>
                    {comunas.filter((item) => item.colaborativo === false).map((item) => 
                        {
                            return(
                                <div className='dropdown-itemlist' key={item.id}>
                                    <div className='dropdown-item' key={item.nombre} onClick={() => {getJsonData(item.nombre, item.id)}}>
                                        {`${item.nombre}`}
                                    </div>
                                </div>)
                        }
                    )}
                    <Divider/>
                    <div className='dropdown-item-tittle'>
                        REDES COLABORATIVAS
                    </div>
                    {comunas.filter((item) => item.colaborativo === true).map((item) => 
                        {
                            return(
                                <div key={item.nombre} className='dropdown-itemlist'>
                                    <div className='dropdown-item' onClick={() => {getJsonData(item.nombre, item.id)}}>
                                        {`${item.nombre}`}
                                    </div>
                                </div>)
                        }
                    )}
                    <Divider/>
                </div>
            }
        </div>
    )
}

export default DropDownMenu

//onClick={() => { removeUser(item.id, item.admin) }}