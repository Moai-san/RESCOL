import "../styles/navbar.scss"

import LogoutIcon from '@mui/icons-material/Logout';

import Avatar from '@mui/material/Avatar';
import { IconButton, Typography} from "@mui/material";
import { useUserContext, useSetLoginContext } from "../../../views/providers/AccountProvider";

//Logos
import logo from '../assets/anid.png'
import rescol from '../assets/rescol-logo.jpeg'

import {Tooltip} from "@mui/material";
const Navbar = () => {
    const user = useUserContext()    
    const setLogged = useSetLoginContext()
    return (
        <div className="navbar">
            <div className="logo">
                <img  src={logo} height='50px'></img>
            </div>
            <div className="logo">
                <img height='60px' src={rescol}></img>
            </div>
            <div className="icons">
                <div className="user">
                    <Avatar sx={{width:'30px',height:'30px', backgroundImage: `linear-gradient(180deg, rgba(31,86,52,1) 0%, rgba(129,180,61,1) 85%)`,}}>{user.username[0].toUpperCase()}</Avatar>
                    <Typography className="user-title">{user.username}</Typography>
                </div>
                <Tooltip title={<Typography>Cerrar sesión</Typography>}>
                    <IconButton className="settings" onClick={()=>setLogged(false)}>
                        <LogoutIcon sx={{color:'black'}}/>
                    </IconButton> 
                </Tooltip>

            </div>
        </div>
    )
}

export default Navbar