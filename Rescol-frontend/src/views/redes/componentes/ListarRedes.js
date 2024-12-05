//React

//MUI
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {IconButton} from '@mui/material';

//CSS & ESTILOS 
import '../styles/listarredes.scss'


//Componentes
import { useEffect, useState } from "react"
import { getRed, deleteRed, getInstance } from '../../../services/redesViales'
import { Typography } from '@mui/material'
import EditRed from './EditRed';
import { ErrorManager } from '../../../services/ErrorManager';

const ListarRedes = ({setRedData, setAlertData}) => {

    const [colRed, setColRed] = useState([])
    const [indRed, setIndRed] = useState([])

    //Control de edición
    const [displayEdit,setDisplayEdit] = useState(false)
    const [editItem, setEditItem] = useState(null)
    
    useEffect(()=>{    
        fetchRedes()
    },[])



    const fetchRedes = async () => {
        try {
            const res = await getRed()
            setColRed(res.data.filter((item) => item.colaborativo === true))
            setIndRed(res.data.filter((item) => item.colaborativo === false))
        } catch (err) {
            //Manejo de errores
            setAlertData(ErrorManager(err.code))
        }
    }

    const fetchInstance = async (id) => {
        const res = await getInstance(id)
        
        setRedData({id:id ,data: res.data.data})
    }

    const removeRed = async (id) => {
        try{
            await deleteRed(id)
            setRedData(null)
            fetchRedes()
        }catch(err){
            //Manejo de errores
            setAlertData(ErrorManager(err.code))
        }
        
        
    }

    const editRed = (item) => {
        setEditItem(item)
        setDisplayEdit(true)
    }




    return (
        <div className='listar-redes-content'>
            {
                displayEdit?
                <div className='red-main-edit'>
                    <Typography fontSize={13} fontWeight={'bold'} sx={{display:'flex', alignItems:'center'}}>
                        <IconButton onClick={()=>setDisplayEdit(false)}><ArrowBackIcon/></IconButton>EDITAR {editItem.nombre.toUpperCase()}
                    </Typography>
                    <EditRed editItem={editItem} setDisplayEdit={setDisplayEdit} setRedData={setRedData}/>
                </div>
                :
            <>
                <Typography fontSize={13} fontWeight={'bold'}>
                                    REGIÓN METROPOLITANA
                                </Typography>
                {indRed.length !== 0 ? indRed.map(item => {
                    return <div key={item.id} > 
                                
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='td-title'><Typography>{item.nombre}</Typography></td>
                                            <td ><Typography key={item.id} className='show-button' onClick={()=>{fetchInstance(item.id)}}>Ver</Typography></td>
                                            <td ><Typography className='edit-button' onClick={()=>{editRed(item)}}>Editar</Typography></td>
                                            <td ><Typography key={item.id} className='delete-button' onClick={()=>{removeRed(item.id)}}>Eliminar</Typography></td>
                                        </tr>
                                    </tbody>
                                </table> 
                            </div>
                }):
                <table>
                                    <tbody>
                                        <tr>
                                            <td className='td-title'><Typography>No exiten redes viales</Typography></td>
                                        </tr>
                                    </tbody>
                                </table> 

                }
                <Typography fontSize={13} fontWeight={'bold'}>
                        REDES COLABORATIVAS
                </Typography>
                {colRed.length !== 0 ? colRed.map(item => {
                    return <div key={item.id} > 
                                
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className='td-title'><Typography>{item.nombre}</Typography></td>
                                            <td ><Typography key={item.id} className='show-button' onClick={()=>{fetchInstance(item.id)}}>Ver</Typography></td>
                                            <td ><Typography className='edit-button' onClick={()=>{editRed(item)}}>Editar</Typography></td>
                                            <td ><Typography key={item.id} className='delete-button' onClick={()=>{removeRed(item.id)}}>Eliminar</Typography></td>
                                        </tr>
                                    </tbody>
                                </table> 
                            </div>
                }):
                <table>
                                    <tbody>
                                        <tr>
                                            <td className='td-title'><Typography>No exiten redes colaborativas</Typography></td>
                                        </tr>
                                    </tbody>
                                </table> 

                }
        
        </>
        }
        </div>
    )
}

export default ListarRedes