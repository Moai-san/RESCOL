//REACT
import {useState} from "react";

//MUI
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//CSS & ESTILOS
import "../users.scss"


const SearchButton = ({updateFilter, search}) => {

    const [filter, setFilter] = useState('username')

    const getSelect = (e) => {
        setFilter(e.target.value)
        updateFilter()
    }

    const renderFilter = () => {
        return(
        <TextField sx={{width:'373px'}} id="outlined-basic-tipo" variant="outlined" size='small' onChange={(e) => {search(filter, e.target.value)}}/>
        )
        
    }

    const getRolValue = (e) => {
        console.log(e)
    }

    return (
        <div className="search-bar">
             <FormControl sx={{ minWidth: 120}} size="small">
                <Select onChange={getSelect} defaultValue ='username'>
                    <MenuItem value={'username'}>Usuario</MenuItem>
                    <MenuItem value={'nombre'}>Nombre</MenuItem>
                    <MenuItem value={'apellido'}>Apellido</MenuItem>
                    <MenuItem value={'correo'}>Correo</MenuItem>
                </Select>
            </FormControl>
            
            {renderFilter(filter)}    
        </div>
    )
}

export default SearchButton
