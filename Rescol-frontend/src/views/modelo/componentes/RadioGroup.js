import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Typography } from '@mui/material';
import "../styles/radiogroup.scss"

export default function RowRadioButtonsGroup({value, setValue}) {


  const handleChange = (e) => {
    setValue(JSON.parse(e.target.value))
    
  }

  return (
    <div className='radio-title'>
      <Typography>Red colaborativa:</Typography>
      
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="true" control={<Radio />} label="Si" />
        <FormControlLabel value="false" control={<Radio />} label="No"/>
      </RadioGroup>
    </FormControl>
    </div>
  );

}