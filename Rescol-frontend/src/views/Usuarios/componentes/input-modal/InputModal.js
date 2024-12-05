import { useState, useEffect } from 'react';
import { Box, Modal } from "@mui/material";
import FormRadioGroup from '../FormRadioGroup';
import uuid from 'react-uuid';
import { postUsers } from '../../../../services/UserApiManager';
import TextField from '@mui/material/TextField';
import {Button} from '@mui/material';

export const InputModal = ({open, setOpen, fetchData}) => {
    const inputParams = [
        {
            id: 1,
            label: 'Nombre',
            type: 'text'
        },
        {
            id: 2,
            label: 'Apellido',
            type: 'text'
        },
        {
            id: 3,
            label: 'Usuario',
            type: 'text'
        },
        {
            id: 4,
            label: 'Correo',
            type: 'text'
        },
        {
            id: 5,
            label: 'Contraseña',
            type: 'password'
        },
        {
            id: 6,
            label: 'Repetir contraseña',
            type: 'password'
        }
    ]

    const [params, setParams] = useState({
        'id': "",
        'username': "",
        'password': "",
        'nombre': "",
        'apellido': "",
        'correo': "",
        'admin': ""
    })

    const [disabled, setDisableButton] = useState(true)
    const [error, setError] = useState(false)


    const [password, setPassword] = useState(null);
    const [repeatPassword, setRepeatPassword] = useState(null);
    const [disablePassoword, setDisablePassoword] = useState(true)

    //estado iniciald el componente
    useEffect(()=>{
        if(open){
            setRepeatPassword(null)
            setDisableButton(true)
            setDisablePassoword(true)
            setError(false)
            const updatedParams = {
                'id': uuid(),
                'username': "",
                'password': "",
                'nombre': "",
                'apellido': "",
                'correo': "",
                'admin': false
            }

            setParams(updatedParams)
        }
    },[open])

    //Comportamiento del botón guardar
    useEffect(() =>{
        if(Object.values(params).every(value => value !== "")){
            setDisableButton(false)
        }else{
            setDisableButton(true)
        }
    },[params])

    //Error de contraseña
    useEffect(()=>{
        if(password !== ''){
            setDisablePassoword(false)
            if(repeatPassword === password){
                setError(false)
                const updatedParams = {...params, ['password']:password}
                setParams(updatedParams)
            }else{
                setError(true)
                const updatedParams = {...params, ['password']:''}
                setParams(updatedParams)
            }
        }else{
            setDisablePassoword(true)
            setError(false)
        }
    },[password, repeatPassword])

   

    const handleClose = () => {
        setError(false)
        setOpen(false)
    }

    const getInput = (e, label, _id) => {
        const input = e.target.value 

        if(label.toLowerCase().includes('contraseña')){
            if (_id === 6){
                setRepeatPassword(input)
            }else{
                setPassword(input)
            }
        }else{
            if(label.toLowerCase() === 'usuario'){
                label = 'username'
            }
            const updatedParams = {...params, [label.toLowerCase()]:input}
            setParams(updatedParams)
        }
    }

    const uploadUser = async() => {
        try{
            const res = await postUsers(params)
            fetchData()
            handleClose()
        }catch(err){
            //manejo de errores
            console.log(err)
        }
    }

    const ModalStyle = {
        backgroundColor:'white',
        width:'max-content',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }

    return (
        <Modal
        open={open}
        onClose={handleClose}
        >
            <Box sx={ModalStyle}>
                <div className="user-modal-card">
                    Registro de usuario
                    <div className="user-input-container">
                        {inputParams.map((item) => {
                            return(    
                                <div className="global-input" key={item.id.toString()}>
                                    <TextField key={item.id.toString()} 
                                               label={item.label} 
                                               error={item.id===6?error:null} 
                                               className="input-content" 
                                               type={item.type}  
                                               onChange={(e)=>getInput(e,item.label, item.id)} 
                                               size="small" 
                                               helperText={item.id===6 && error?'La contraseña no coincide':null}
                                               disabled={item.id===6?disablePassoword:null}
                                    ></TextField>
                                </div>)
                        })}
                        
                        <div className="global-input">
                            <span className="user-span-input">¿Es administrador?</span>
                            <FormRadioGroup getInput={getInput}/>
                        </div>
                    </div>
                    <Button className='button-3'sx={{backgroundColor:'#2ea44f'}} variant="contained" onClick={uploadUser} disabled={disabled}> Guardar</Button>
                </div>
            </Box>
        </Modal>
    )
}
