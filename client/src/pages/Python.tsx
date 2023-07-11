import React from 'react';

import AIChat from '..//components/Chat';

import "./css/PythonPage.css";

const RestApi: React.FunctionComponent = () => {
    return (
        <div className="PageContainer">
            <div className="ChatContainer">
                <AIChat/>
            </div>
        </div>
        
        
    )
}

export default RestApi;