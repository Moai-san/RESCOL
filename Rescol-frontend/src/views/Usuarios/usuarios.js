import "./users.scss"
import { useEffect, useState, useCallback } from "react"
import { useSetAlertDataContext } from "../providers/DataProvider"
import { getUsers, deleteUser } from "../../services/UserApiManager";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { InputModal } from "./componentes/input-modal/InputModal";
import AlertNotification from "../main/componentes/Alert";
import SearchButton from "./componentes/SearchButton";
import RolFilter from "./componentes/RadioGroup"
import {Button} from "@mui/material";

import { Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';



const Users = () => {
    const [data, setData] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [filt, setfilt] = useState(null)
    const [open, setOpen] = useState(false)
    const [ready, setReady] = useState(false)

    const setAlertData = useSetAlertDataContext()

    //API MANAGMENT

    const fetchData = async () => {
        try{
            const res =  await getUsers()
                .then((response) => response.data)

            if(filt === 'admin'){
                setData(res.filter((item) => item.admin === true))
            }else if(filt === "user"){
                setData(res.filter((item) => item.admin === false))
            }else{
                setData(res)
                setGlobalData(res)
            }
        }catch{
            //Manejo de errores
        }
        
    }

    useEffect(()=>{
        fetchData()
    },[])

    const removeUser = async (id, rol) => {
        if(rol && data.filter((item)=> item.admin === true).length === 1){
            setAlertData({title:'ERROR', text:'Debe existir al menos un administardor', type:"error"})
            
        }else{
            await deleteUser(id)
            setAlertData({title:'ÉXITO', text:'El usuario ha sido eliminado correctamente', type:"success"})
            //fetchData()
        }
        setReady(true)
        
    }
    const collapse = (e) => setReady(null)
    
    const updateFilter = () => {
        //fetchData()
    }

    const search = (filter, value) => {
        const request = globalData.filter((item) => item[filter].toLowerCase().startsWith(value.toLowerCase()))
        if(value !== '' && request.length !== 0){
            setData(request)
        }else{
            //fetchData()
        }
    }

    const headers = ['NOMBRE DE USUARIO','NOMBRE','APELLIDO','CORREO','RANGO', 'ACCIONES']
    
    return (
        <div className="user-main-container">
            <InputModal open={open} setOpen={setOpen} fetchData={fetchData}/>
            <Typography> <FilterListIcon/> Filtros</Typography>
            <div className="tools-header-container">
                <RolFilter setfilter={setfilt}/>
                <SearchButton updateFilter={updateFilter} search={search}/>
                <Button sx={{backgroundColor:'#2ea44f' , gap:'10px'}} onClick={()=>{setOpen(true)}} variant="contained"> <PersonAddIcon/> Agregar usuario</Button>
            </div>
            <table className='users'>
                <thead>
                    {headers.map((item) => {
                        return <td >{item}</td>
                    })}
                </thead>
                {data && data.map((item) => {
                    return(
                        <tr>
                            <td>
                                <div className="user-column-content">
                                    <div>{item.username}</div>
                                </div>
                            </td>
                            <td >{item.nombre}</td>
                            <td >{item.apellido}</td>
                            <td >{item.correo}</td>
                            <td >{item.admin?'Administrador':'Usuario'}</td>
                            <td> 
                                <div className="action-colum-content">
                                    {false && <div className="edit-button">Editar</div>}
                                    <div className="delete-button" onClick={() => { removeUser(item.id, item.admin) }}>Borrar</div>
                                </div>
                            </td>
                        </tr>
                        )
                })}
                
            </table>
        </div>
    )
}

export default Users

/* <InputModal open={open} setOpen={setOpen} fetchData={fetchData}/>
    {ready &&  <AlertNotification alertData={alertData} collapse={collapse}/>}
*/