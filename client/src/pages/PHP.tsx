import React from 'react';
import {AllSlides} from '../components/content/RestApiSlides';

import 'bootstrap/dist/css/bootstrap.min.css';

import './css/PHPpage.css';
import Slides from '..//components/Slides';
import PaperStack from '..//components/PaperStack';
import {PHPPaperStack} from '../components/content/PHPPaperStack';
import {RestApiDocs} from '../components/content/RestApiDocs';


const PHP: React.FunctionComponent = () => {
    return (
        <div className="PHPpage">
            <div className='WidgetContainer' >  
                <PaperStack PStack={RestApiDocs}/>
            </div>

            <div className='WidgetContainer' >  
                <Slides allSlides={AllSlides}/>
            </div>
        </div>
        
    )
}

export default PHP;