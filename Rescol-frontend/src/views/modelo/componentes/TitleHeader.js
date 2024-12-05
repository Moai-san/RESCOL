//React
import { useState, useRef, useEffect } from "react";
//MUI
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

//CSS & ESTILOS 
import "../styles/titleHeader.scss"

//COMPONENTES
import { IconButton, Typography, Tooltip } from "@mui/material";


const TitleHeader = ({projectName, setProjectName, setDisabled}) => {
    
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [changed, setChange] = useState(false)
    const inputRef = useRef(null); // Referencia al input

    useEffect(()=>{
        inputRef.current && inputRef.current.focus();
        inputRef.current && inputRef.current.select();
    },[editing])

    const handleEditClick = () => {
        setEditing(true);
        setDisabled(true)
        
    };

    const handleInputChange = (e) => {
        setChange(true)
        if(e.target.value === ''){
            setNewName(projectName);
        }else{
            setNewName(e.target.value);
        }
        
    };

    const handleSaveClick = () => {
        if(changed){
            setProjectName(newName);
        }else{
            setProjectName(projectName);
        }
        setDisabled(false)
        setEditing(false);
        setChange(false)
    };


    return (
        <div className="worktable-title-header">
            {editing?
                <>
                    <div class="input-wrapper">
                        <input class="input-box" ref={inputRef} type="text" placeholder={projectName} defaultValue={projectName} onChange={handleInputChange}/>
                    </div>
                    <div className="edit-button" onClick={handleSaveClick}>
                        <Tooltip title='Guardar'>
                            <IconButton onClick={handleEditClick}>
                                <SaveIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </>
                :
                <>
                    <Typography variant="subtitle1">
                        {projectName}
                    </Typography>
                    <Tooltip title='Renombrar escenario'>
                        <IconButton onClick={handleEditClick}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                </>
            }
        </div>
    )
}

export default TitleHeader