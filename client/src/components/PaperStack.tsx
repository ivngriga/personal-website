import React, {useState} from 'react';

import  './css/PaperStack.css';

interface Paper{
    title: string,
    color: string,
    description: string | JSX.Element
}


const PaperStack: React.FunctionComponent<{PStack: Array<Paper>}> = ({PStack}) => {
    const [hoveringOver, setHoveringOver]=useState(-1000);
    const [pinned, setPinned]=useState(false);

    console.log(pinned)

    return (
        <div className='PaperStackContainer'>
            {
                PStack.map((item, index) => {
                    var diff=index-hoveringOver;

                    var Stagger=(60/PStack.length)*index+7;
                    var paperClass="Paper";
                    var StaggerComp= hoveringOver==-1000 ? 0 : 25*diff;
                    
                    var Rotation= (diff==0 ? "rotateX(15deg) rotateY(-15deg)" : "rotateX(25deg) rotateY(-30deg)");

                    var buttonInfo = {
                        "class":"PinPaper",
                        "disabled":false,
                        "text": "Pin"
                    }
                    

                    if(diff==0){
                        //paperClass+=" selected";
                        if(pinned){
                            buttonInfo.class+=" selectedB"
                            buttonInfo.text="Unpin"
                        }
                        
                    } else if(hoveringOver!=-1000) {
                        if(pinned){
                            buttonInfo.disabled=true;
                        }
                    }

                    return(
                        <div className={paperClass}
                            onMouseOver={() => setSelected(index)}
                            onMouseOut={() => deSelect(index)} 
                            style={{
                                position: "absolute", 
                                backgroundColor: item.color, 
                                left: (StaggerComp+Stagger)+"%",
                                transform: Rotation
                            }}>
                            <div className="TCDiv">
                                <div className="PaperTitle">
                                    {item.title} 
                                </div>

                                <div className="PaperDescription">
                                    <div className="text">
                                        {item.description}
                                    </div>
                                </div>
                            </div>

                            <div className='PaperFooter'>
                                <button disabled={buttonInfo.disabled} className={buttonInfo.class} onClick={()=>pin(index)}>{buttonInfo.text}</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )

    function pin(ind: number){
        setPinned(!pinned);
        if(pinned){
            deSelect(ind);
        }
        
    }

    function setSelected(ind: number){
        if(!pinned){
            setHoveringOver(ind);
        }
        
    }

    function deSelect(ind: number){
        if(!pinned){
            setHoveringOver(-1000);
        }
    }
}

export default PaperStack;