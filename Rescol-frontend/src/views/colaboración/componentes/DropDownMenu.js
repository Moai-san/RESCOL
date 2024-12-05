//React
import { useState, useEffect, useRef } from 'react';

//MUI
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

//CSS & ESTILOS 

//Componentes

import { getRed } from "../../../services/redesViales";


const factors = [
    {
        id: 0,
        type:'factors',
        nombre: 'Partes Iguales'
    },
    {
        id: 1,
        type:'factors',
        nombre: 'Per cápita'
    },
    {
        id: 2,
        type:'factors',
        nombre: 'Por producción per cápita'
    },
    {
        id: 3,
        type:'factors',
        nombre: 'Por ahorro'
    },
    {
        id: 4,
        type:'factors',
        nombre: 'Por ingresos por hogar'
    }
]

const main = [
    {
        id: 0,
        type:'main',
        nombre: 'Por mismo escenario'
    },
    {
        id: 1,
        type:'main',
        nombre: 'Por colaboración'
    }
]

const DropDownMenu = ({type, option, setOption}) => {

    const [activate, setActivate] = useState(false)
    const [itemList, setItemList] = useState(null)
    const [title, setTitle] = useState(null)

    const dropdownRef = useRef(null);

    useEffect(()=>{
        if(type === 'factors'){
            setTitle('Por ahorro')
            setItemList(factors)
            setOption(factors[3])
        }
        else if(type === 'comunas'){
            setTitle('Escoge un escenario')
            getComunas(false)
        }
        else if(type === 'comunas-colab'){
            setTitle('Escoge un escenario')
            getComunas(true)
        }
        else if(type === 'main'){
            setTitle('Escoge tipo de comparación')
            setItemList(main)
            const default_ = main[0]
            setOption(default_)
            setTitle(default_.nombre)
        }
    },[])

    const getComunas = async(filt) => {
        try{
            const res = await getRed()
            if(!filt){
                setItemList(res.data)
            }else{
                setItemList(res.data.filter(item => item.colaborativo === true))
            }
        } catch (err){
            //Manejo de errores
        }
        
    }

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
    

    const activateDropMenu = () => {
        setActivate(!activate)
    }

    const onChangeFactor = (item) => {
        if(type === 'comunas'){
            setOption({...item, type:"comunas"})
        }else{
            setOption(item)
        }
        setTitle(item.nombre)
        activateDropMenu()
    }


    return (
        <div className="dropdown" style={{width:'60%'}} ref={dropdownRef}>
            <div className={`dropdown-title-content ${activate? 'dropdown-activate': ''}`} onClick={activateDropMenu}>
                <span>{title}</span> {activate? <ArrowDropUpIcon/>:<ArrowDropDownIcon/>}
            </div>

            {activate && 
                <div className="dropdown-content">
                    <div className="triangulo"></div>
                    <div className='dropdown-item-tittle'>
                        SELECCIONA UNA OPCIÓN
                    </div>
                    {itemList && itemList.map((item) => 
                        {
                            return(
                                <div className='dropdown-itemlist' key={item.id}>
                                    {option && option.id === item.id?
                                        <div style={{color:'#239af5'}}>{`${item.nombre}`}</div>
                                        :
                                        <div className='dropdown-item' onClick={() => onChangeFactor(item)}>
                                        {`${item.nombre}`}
                                        </div>
                                    }
                                </div>)
                        }
                    )}
                </div>
            }
        </div>
    )
}

export default DropDownMenu

//onClick={() => { removeUser(item.id, item.admin) }}