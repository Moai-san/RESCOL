import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export default function FormRadioGroup({getInput}) {
  return (
    <FormControl sx={{marginTop:'9px'}}>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        defaultValue={false}
        onChange={(e)=>getInput(e,'admin')}
      >
        <FormControlLabel value={true} control={<Radio />} label="Si" />
        <FormControlLabel value={false} control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  );
}