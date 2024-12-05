// Utilidad React
import { useState, useEffect } from 'react';

//MUI: Componentes
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';

//CSS
import '../styles/alert.scss'


function Notification({text, type, title}) {
    
    return (
        <div className='notification-container'>
            <div className='test'>hola</div>
        </div>
      )
}
export default Notification;