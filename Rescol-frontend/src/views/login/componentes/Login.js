//React
import { useState } from 'react';

//MUI
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import ErrorIcon from '@mui/icons-material/Error';

//CSS & ESTILOS 
import "../styles/login.scss"
import icon from '../assets/Logo_inicio.svg'


//Api
import { identifyUser, identifyPassword } from '../../../services/UserApiManager';
import { useNavigate } from 'react-router-dom';
import { ErrorManager } from '../../../services/ErrorManager';

//Componentes
import { useSetUserContext } from '../../providers/AccountProvider';
import AlertNotification from '../../main/componentes/Alert';

const Login = ({setLog}) => {

    //Generales
    const navigate = useNavigate();
    const [password, setPassword] = useState(null)
    const [username, setUsername] = useState(null)
    const [alertData, setAlertData] = useState(null)
    const setUser = useSetUserContext()

    //Control de estilo - inputs
    const [errorUser, setErrorUser] = useState(false)
    const [errorPass, setErrorPass] = useState(false)
    
    //Gestor de errores
    const [ErroMessage, setErrorMessage] = useState(null)

    
   
    
    //Manejo de errores de inicio de sesión
    const autenticateAccount = async() => {
        try{
            const res = await identifyUser(username)
                            .then((response) => response.data)
            //Autenticar contraseña
            var pass = ''
            if(res){
                try{
                    pass = await identifyPassword(username, password)
                            .then((response) => response.data)
                }catch(err){
                    console.log(err)
                }
                
                if(pass.password){
                    setLog(true)
                    navigate('/principal');

                }
                else if(password === null || password === ''){
                    setAlertData(ErrorManager('PWRD_NOT_ENTERED'))
                    setErrorPass(true)
                }else{
                    setAlertData(ErrorManager('WRONG_PWRD'))
                    setErrorPass(true)
                }
                setUser({id:res.id, username:res.username, admin: res.admin})
            }
            
        }catch(err){
            console.log(err)
            if(username === null || username === ''){
                const msg = ErrorManager('USER_NOT_ENTERED')
                setAlertData(msg)
                setErrorMessage(msg.text)
            }else if(err.response && err.response.status === 404){
                setAlertData(ErrorManager(err.response.data.code))
            }
            else{
                console.log(err.code)
                setAlertData(ErrorManager(err.code))
            }
            setErrorUser(true)  
        }
    }


    const getUser = (e) => {
        setErrorUser(false)
        setUsername(e.target.value)
    }
    

    const getPassword = (e) => {
        setErrorPass(false)
        setPassword(e.target.value)
    }

    return (
        <div className='login-back'>
            {alertData && <AlertNotification alertData={alertData} setAlertData={setAlertData}/> }
            <div className="login-box">
                <img src={icon} height={'130px'}>
                </img>
                <span className="span-title">¡Bienvenido a Rescol!</span>
                <span className="span-content">Inicia sesión con tu cuenta</span>
                <span className='span-input'>{errorUser?<ErrorIcon sx={{ fontSize: 15 }}/> :null} Nombre de usuario </span>
                <div className={errorUser?"input-container input-error":"input-container"}>
                    <AccountCircleIcon className={errorUser?'icon-content-error':'icon-content'}/>
                    <input className="input-content" onChange={getUser}></input>
                </div>
                <span className={'span-input'}> {errorPass?<ErrorIcon sx={{ fontSize: 15 }}/>:null} Contraseña</span>
                <div className={errorPass?"input-container input-error":"input-container"}>
                    <LockIcon className={errorPass?'icon-content-error':'icon-content'}/>
                    <input className="input-content" type="password" onChange={getPassword}></input>
                </div>
                <button className='login-button' onClick={autenticateAccount}>INGRESAR</button>
            </div>
        </div>  
    )
}

export default Login

// data-decrypt

/*

            console.log(res)
            
            if(res){
                if(res.password === password){
                    setLog(true)
                    navigate('/');

                }
                else if(password === null || password === ''){
                    setErrorMessage('Ingrese una contraseña')
                    setErrorPass(true)
                }else{
                    setErrorPass(true)
                    setErrorMessage('Contraseña incorrecta')
                }
                setUser({id:res.id, username:res.username, admin: res.admin})
            }
*/