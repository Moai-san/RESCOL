import { Typography } from '@mui/material';
import '../styles/itembox.scss'

//Material
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ItemBox = ({id, text, onClick}) => {

    return (
        <>
            <div id={id} className='item-box' onClick={()=>{onClick(id)}}>
                <Typography>{text} </Typography>
                <KeyboardArrowDownIcon/>
            </div>
        </>
    )
}

export default ItemBox 