import React, {useState} from 'react';

import  './css/Slides.css';

interface SlidesInterface {
    // allSlides must be an array containing functioncomponents with updateFunction and data as mandatory inputs for each slide
    allSlides: Array<(
        React.FunctionComponent<{
            updateFunction: Function,
            data?: Object
        }
    >)>,
}

const Slides: React.FunctionComponent<SlidesInterface> = ({allSlides}) => {
    const [slide, setSlide] = useState(0);
    const [data, setData] = useState({});

    const updateData=(newData: Object, slideID?: number) => {
        setData(newData);
        if(slideID!=undefined) setSlide(slideID);
    }

    console.log(data);

    function getSlide(i: number){
        let Component=allSlides[i];
        return <Component updateFunction={updateData} data={data}/>
    }

    return (
          <div className='SlidesContainer'>
            {getSlide(slide)}
          </div>

    )
}

export default Slides;