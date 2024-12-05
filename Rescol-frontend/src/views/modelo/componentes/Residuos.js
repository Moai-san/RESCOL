
import Slider from '@mui/material/Slider';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import '../styles/parametres.scss'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InfoIcon from '@mui/icons-material/Info';
import InputAdornment from '@mui/material/InputAdornment';





export default function RSD({parametres, setParametres}) {



  const [activate, setActivate] = useState([true, false, false, false, false, false])

  const handleRSDChange = (e) => {
    setParametres({...parametres, residuos: e.target.value})
  }

  const handleTONChange = (e) => {
    setParametres({...parametres, capacidad: e.target.value})
  }

  const handleLABChange = (e) => {
    setParametres({...parametres, jornada: e.target.value})
  }


  const handleCOSChange = (e) => {
    const newValue = e.target.value;
    if(newValue === '') {
        setParametres({...parametres, costo: 0});
    } else {
        const costo = parseInt(newValue)
        if(costo <= 2000) setParametres({...parametres, costo: costo})
        else setParametres({...parametres, costo: 2000});
    }
  }

  const handleRECChange = (indice, f) => {

    for (let i = 0; i < 6; i++) {
      if (i === indice-1) {
          activate[i] = true;
      } else {
          activate[i] = false;
      }
    }
    setActivate(activate)
    setParametres({...parametres, frecuencia: f})
  }

  const infoButton = (info) => {
    return(
      
      <Tooltip title={<Typography>{info}</Typography>}
               placement="right">
        <IconButton>
          <InfoIcon sx={{width:'15px', height:'15px'}}/>
        </IconButton>
      </Tooltip>
    )
  }



  return (
    <div className='parametros-area'>
      <div>
        <Typography>Día de recolección
        {infoButton('Día el cual se recolecta residuos.\n Lunes/Martes: 3 días de acumulación de residuos.\n Miércoles/Juves/Viernes/Sábado: 2 días de acumulación de residuos.')}
        </Typography>
        <div className='frecuencia-area'>
          <Tooltip title='Lunes'><div className={`frecuencia-items ${activate[0] && 'frecuencia-activate'}`} onClick={() => handleRECChange(1,3)}><Typography>L</Typography></div></Tooltip>
          <Tooltip title='Martes'><div className={`frecuencia-items ${activate[1] && 'frecuencia-activate'}`} onClick={() => handleRECChange(2,3)}><Typography>M</Typography></div></Tooltip>
          <Tooltip title='Miércoles'><div className={`frecuencia-items ${activate[2] && 'frecuencia-activate'}`} onClick={() => handleRECChange(3,2)}><Typography>M</Typography></div></Tooltip>
          <Tooltip title='Jueves'><div className={`frecuencia-items ${activate[3] && 'frecuencia-activate'}`} onClick={() => handleRECChange(4,2)}><Typography>J</Typography></div></Tooltip>
          <Tooltip title='Viernes'><div className={`frecuencia-items ${activate[4] && 'frecuencia-activate'}`} onClick={() => handleRECChange(5,2)}><Typography>V</Typography></div></Tooltip>
          <Tooltip title='Sábado'><div className={`frecuencia-items ${activate[5] && 'frecuencia-activate'}`} onClick={() => handleRECChange(6,2)}><Typography>S</Typography></div></Tooltip>
        </div>
 
      </div>
      
      <div className='residuos-area'>
      <Typography>Generacion de residuos (%)
        {infoButton('Porcentaje de aumento o disminución de residuos')}
        </Typography>
        <div className='residuos-item'>
          <Slider
              value={parametres.residuos}
              onChange={handleRSDChange}
              step={0.5}
              min={-2}
              max={2}
              marks
              sx={{width:'240px'}}
          />
          <div className='value-cpntainer'>
            <Typography>{parametres.residuos}</Typography> 
          </div>
        </div>
        
      </div>


      <Typography>Costo de transporte
          {infoButton('Costo del transporte de residuos por kilómetro')}
        </Typography>

        <div className={`file-input-container`}>
                <InputAdornment position="start">$</InputAdornment>
                <input  className="file-input-name" 
                        placeholder={parametres.costo}
                        value={parametres.costo}
                        type='text'
                        onChange={handleCOSChange}
                />
        </div>

        <FormControl>
        <Typography>Capacidad de vehículos (t)
        {infoButton('Capacidad máxima por vehículo en toneladas')}
        </Typography>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={parametres.capacidad}
          onChange={handleTONChange}
        >
          <FormControlLabel value={6} control={<Radio size="small" />} label="6" />
          <FormControlLabel value={10} control={<Radio size="small" />} label="10"/>
          <FormControlLabel value={15} control={<Radio size="small" />} label="15"/>
        </RadioGroup>
      </FormControl>

      <FormControl>
        <Typography>Jornada laboral (h)
        {infoButton('Joranada laboral en horas')}
        </Typography>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={parametres.jornada}
          onChange={handleLABChange}
        >
          <FormControlLabel value={8} control={<Radio size="small" />} label="8" />
          <FormControlLabel value={10} control={<Radio size="small" />} label="10"/>
          <FormControlLabel value={12} control={<Radio size="small" />} label="12"/>
        </RadioGroup>
      </FormControl>
    </div>
    
  );
}
