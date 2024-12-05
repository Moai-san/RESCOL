// Utilidad React
import { useState, useEffect } from 'react';

//MUI: Componentes
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';

//CSS
import '../styles/alert.scss'


function AlertNotification({alertData, setAlertData}) {
    const [openCollapse, setOpenCollapse] = useState(true);


    useEffect(() => {
        const timeout = setTimeout(() => {
          setOpenCollapse(false); // Cerrar el Collapse después de cierto tiempo
          setAlertData(null)
        }, 3000); // Cambia este valor para ajustar la duración del Collapse
    
        return () => clearTimeout(timeout);
    }, []);

    const killCard = () =>{
      setAlertData(null)
      setOpenCollapse(false)
    }
    
    return (
            alertData && <div className='alert-container'>
            <Collapse in={openCollapse}>
            <Alert severity={alertData.type} variant="filled" 
            action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={killCard}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }>
              <strong>{alertData.title}</strong>— {alertData.text}
            </Alert>
            </Collapse>
            </div>
      );
}

export default AlertNotification;