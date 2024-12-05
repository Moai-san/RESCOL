import "../styles/noCollab.scss"
import { Divider } from "@mui/material"
import EmptyCardItem from "./EmptyCardItem";

import CardItem from "./CardItem";
import { useEffect, useState } from "react";
import DropDownMenu from "./DropDownMenu";
import {Typography} from "@mui/material";

const NoCollabView = ({setModal, setModels, cardList, setCardList, models, setRedId}) => {

    const [option, setOption] = useState(null)

    const [disabled, setDisabled] = useState(true)

    useEffect(()=>{
        if(option){
            setRedId(option.id)
            setModels([])
            setCardList([])
            setDisabled(false)
        }
    },[option])


    return (
        <>
        <div className="stats-dropsown-container">
            <DropDownMenu type='comunas' option={option} setOption={setOption}/>
        </div>
        <div className="no-collab-container">
            
                <>
                <EmptyCardItem setModal={setModal} disabled={disabled}/> 
                {cardList.map((item, index )=> {
                    return(
                        <>
                            {
                            index !== 0 && <Divider>
                                <div className="vs-item" key={item.id} >
                                    vs 
                                </div>
                            </Divider>
                            }
                            <CardItem key={item.id} 
                                      showDelete={true} 
                                      item={item} index={index} 
                                      cardList={cardList} 
                                      setCardList={setCardList} 
                                      setModels={setModels} 
                                      models={models}
                            />

                        </>
                    )
                })}
                </>
        </div>
    </>
    )
}

export default NoCollabView 
