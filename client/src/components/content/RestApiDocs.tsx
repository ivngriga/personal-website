import React from 'react';

export const RestApiDocs = [
    {
        "title": "PHP API documentation",
        "color": "blanchedalmond",
        "description": "This API consists of two tables: users and messages. Everyone can read messages, but only a authenticated user can make or delete messages."
    },
    {
        "title": "Login",
        "color": "azure",
        "description": "On the first slide, login by inputting existing credentials or create a new user by simply filling in the username and password fields."
    },
    {
        "title": "Fetch messages (GET)",
        "color": "floralwhite",
        "description": (()=>{
            return (
                <>
                <b>Api Endpoint:</b> /api/msg/list<br></br>
                <b>Method:</b> GET<br></br>
                <table style={{fontSize:"1.3vw", border:"solid"}}>
                    <thead>
                        <tr>
                            <th>Query</th>
                            <th>Type</th>
                            <th>Function</th>
                            <th>Required</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>limit</td>
                            <td>int{">"}0</td>
                            <td>Limit amount of message(s) returned</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>msguser</td>
                            <td>string</td>
                            <td>Find message(s) by msguser</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>msgid</td>
                            <td>string</td>
                            <td>Find message by msgid</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>msgtext</td>
                            <td>string</td>
                            <td>Find message(s) by msgtext</td>
                            <td>No</td>
                        </tr>
                    </tbody>
                </table>
                </>
            )
        })()
    },
    {
        "title": "Create Message (POST)",
        "color": "aquamarine",
        "description": (()=>{
            return (
                <>
                <b>Api Endpoint:</b> /api/msg/create<br></br>
                <b>Method:</b> POST<br></br>
                <table style={{fontSize:"1.3vw", border:"solid"}}>
                    <thead>
                        <tr>
                            <th>Body Param</th>
                            <th>Type</th>
                            <th>Function</th>
                            <th>Required</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>usrname</td>
                            <td>string</td>
                            <td>Authorization</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>usrpass</td>
                            <td>string</td>
                            <td>Authorization</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>msgtext</td>
                            <td>string</td>
                            <td>Set message text</td>
                            <td>Yes</td>
                        </tr>
                    </tbody>
                    
                </table>
                </>
            )
        })()
    },
    {
        "title": "Delete Message (POST)",
        "color": "lemonchiffon",
        "description": (()=>{
            return (
                <>
                <b>Api Endpoint:</b> /api/msg/delete<br></br>
                <b>Method:</b> POST<br></br>
                <table style={{fontSize:"1.3vw", border:"solid"}}>
                    <thead>
                        <tr>
                            <th>Body Param</th>
                            <th>Type</th>
                            <th>Function</th>
                            <th>Required</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>usrname</td>
                            <td>string</td>
                            <td>Authorization</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>usrpass</td>
                            <td>string</td>
                            <td>Authorization</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>msguser</td>
                            <td>string</td>
                            <td>Find message(s) by msguser</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>msgid</td>
                            <td>string</td>
                            <td>Find message by msgid</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>msgtext</td>
                            <td>string</td>
                            <td>Find message(s) by msgtext</td>
                            <td>No</td>
                        </tr>
                    </tbody>
                    
                </table>
                </>
            )
        })()
    },
    
];