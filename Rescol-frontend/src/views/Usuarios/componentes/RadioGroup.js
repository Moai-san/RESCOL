import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default function RolFilter({setfilter}) {
  return (
    <FormControl sx={{marginTop:'9px'}}>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue={'all'}
        onChange={(e)=>{setfilter(e.target.value)}}
        >
        <FormControlLabel value={'all'} control={<Radio />} label="Todos" />
        <FormControlLabel value={'admin'} control={<Radio />} label="Administrador" />
        <FormControlLabel value={'user'} control={<Radio />} label="Usuario" />
      </RadioGroup>
    </FormControl>
  );
}