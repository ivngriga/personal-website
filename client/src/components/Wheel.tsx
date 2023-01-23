import React, {useState} from 'react';

import './css/Wheel.css';

export interface ShortItem{
    title: string,
    description: string,
    path: string
}

const Wheel: React.FunctionComponent<{shortItems: Array<ShortItem>}> = ({shortItems}) => {
    const [currentItem, setCurrentItem] = useState(0);
    const [currentDegree, setCurrentDegree] = useState(0);
    const itemCount = shortItems.length;

    return (
        <div className='WheelContainer' style={{marginTop: "10vw", marginBottom: "10vw", marginLeft: "10vw"}}>
            <div className="HollowCircle" id="wheel">
                {
                    shortItems.map((item, index) => {
                        var rotate=-index*(360/itemCount);
                        var rotateCompensation=-currentDegree-rotate;
                        var boxClassName="TitleBox"
                        var textClassName="TitleText"

                        console.log(window.innerWidth)

                        if(index===currentItem){
                            boxClassName="TitleBoxCurrentItem"
                            textClassName="TitleText selectedText"
                        } else if (window.innerWidth<=480) {
                            rotate+=90
                            rotateCompensation-=90
                        }
 
                        return (
                            <div key={index.toString()} className={boxClassName} id={"titleBox-"+index} style={{transform: `rotate(${rotate}deg)`}}>
                                <div onClick={()=>moveToIndex(currentItem, index, setCurrentItem, itemCount, currentDegree, setCurrentDegree)} key={index.toString()} className={textClassName} id={"title-"+index} style={{transform: `rotate(${rotateCompensation}deg)`}}>
                                    {item.title}
                                </div>
                            </div>
                        )
                            
                    })
                }
            </div>
            
            
            
            <div className="DescriptionBox">
                <div className="Description"> 
                    {shortItems[currentItem].description}
                </div>
                
                <div className="DescriptionBoxFooter" id ="buttonContainer">
                    {shortItems[currentItem].path != "" && (
                        <a href={shortItems[currentItem].path} className="LearnMore">Learn More</a>
                    )}

                    <div className="ButtonContainer">
                        <div className="PrevButton icon" onClick={()=>moveToIndex(currentItem, currentItem-1, setCurrentItem, itemCount, currentDegree, setCurrentDegree)}>
                            <div className="arrow" ></div>
                        </div>

                        <div className="NextButton icon" onClick={()=>moveToIndex(currentItem, currentItem+1, setCurrentItem, itemCount, currentDegree, setCurrentDegree)}>
                            <div className="arrow" ></div>
                        </div>
                    </div>
                    <div className="Clear"> </div>
                </div>
            </div>
            
            <div className="Clear"></div>

        </div>
        
    )
}

export default Wheel;

function moveToIndex(cur: number, target: number, setCur: Function, len: number, degree: number, setDeg: Function){
    if(target>=len){
        target=0
    } else if (target<0){
        target=len-1
    }
    
    var wheel = document.getElementById('wheel');
    var diff=target-cur;

    if(diff<0){
        diff+=len
    }

    if(diff<=len/2){
        degree+=(360/len)*diff;
    } else {
        degree-=(360/len)*(len-diff);
    }
    
    setDeg(degree)
    setCur(target)

    if(wheel){
        wheel.style.transform = 'rotate('+degree+'deg)';
    }
}