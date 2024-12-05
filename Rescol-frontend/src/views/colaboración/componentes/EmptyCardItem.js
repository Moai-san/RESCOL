import "../styles/noCollab.scss"
import AddIcon from '@mui/icons-material/Add';

const EmptyCardItem = ({setModal, disabled}) => {

    return (
            <div style={{height:'50px'}}className={`${disabled?'no-collab-item-disabled':'no-collab-item'}`} onClick={()=> !disabled && setModal(true)}>
                <div className="add-item"><AddIcon/></div>
            </div>
    )
}

export default EmptyCardItem 