import React from 'react';
import Wheel from '../components/Wheel';

import {shortItems} from '../components/content/HomeItems';

const Home: React.FunctionComponent = () => {
    return (
        <Wheel shortItems={shortItems}/>
    )
}

export default Home;