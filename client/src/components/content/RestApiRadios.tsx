import React from "react";

export interface APIRadios {
    "id":number,
    "url":string,
    "method":string,
    "headers":string,
    "body":string;
    "desc":string
}

export const Slide2Radios: Array<APIRadios> = [
    {
        "id":1,
        "url":"http://localhost:8000/api/msg/list?limit=20",
        "method":"GET",
        "headers":"{'content-type': 'application/json'}",
        "body":"{}",
        "desc":"Correct request."
    },
    {
        "id":6,
        "url":"http://localhost:8000/api/msg/list?limit=20&msguser=dummyUser",
        "method":"GET",
        "headers":"{'content-type': 'application/json'}",
        "body":"{}",
        "desc":"Correct request (dummyUser's messages)."
        
    },
    {
        "id":2,
        "url":"http://localhost:8000/api/msg/list?limit=abc",
        "method":"GET",
        "headers":"{'content-type': 'application/json'}",
        "body":"{}",
        "desc":"Incorrect limit param."
    },
    {
        "id":3,
        "url":"http://localhost:8000/api/msg/list",
        "method":"GET",
        "headers":"{'content-type': 'application/json'}",
        "body":"{}",
        "desc":"No limit param."
    },
    {
        "id":4,
        "url":"http://localhost:8000/api/mg/list?limit=2",
        "method":"GET",
        "headers":"{'content-type': 'application/json'}",
        "body":"{}",
        "desc":"Incorrect URL."
    },
    {
        "id":5,
        "url":"http://localhost:8000/api/msg/list?limit=20",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":"{}",
        "desc":"Incorrect Method."
    },

    
]

export const Slide3Radios: Array<APIRadios>=[
    {
        "id":1,
        "url":"http://localhost:8000/api/msg/create",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "usrpass":"password", "msgtext":"This is a sample message"}',
        "desc":"Correct request."
    },
    {
        "id":2,
        "url":"http://localhost:8000/api/msg/create",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "usrpass":"password"}',
        "desc":"No Message"
    },
    {
        "id":3,
        "url":"http://localhost:8000/api/msg/create",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "usrpass":"incorrectpswrd", "msgtext":"This is a sample message"}',
        "desc":"Incorrect Password"
    },
    {
        "id":4,
        "url":"http://localhost:8000/api/msg/create",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "msgtext":"This is a sample message"}',
        "desc":"No Password"
    },
    {
        "id":5,
        "url":"http://localhost:8000/api/msg/create",
        "method":"GET",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "usrpass":"password", "msgtext":"This is a sample message"}',
        "desc":"Wrong Method"
    },
]

export const Slide4Radios: Array<APIRadios> = [
    {
        "id":1,
        "url":"http://localhost:8000/api/msg/delete",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "usrpass":"password", "msgid":"messageid"}',
        "desc":"Correct Request."
    },
    {
        "id":2,
        "url":"http://localhost:8000/api/msg/delete",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"msguser":"username", "usrname":"username", "usrpass":"password"}',
        "desc":"Try deleting by user name."
    },
    {
        "id":3,
        "url":"http://localhost:8000/api/msg/delete",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "usrpass":"incorrectpswrd", "msgid":"messageid"}',
        "desc":"Incorrect Password."
    },
    {
        "id":4,
        "url":"http://localhost:8000/api/msg/delete",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "usrpass":"password"}',
        "desc":"No Identifiers."
    },
    {
        "id":4,
        "url":"http://localhost:8000/api/msg/delete",
        "method":"POST",
        "headers":"{'content-type': 'application/json'}",
        "body":'{"usrname":"username", "usrpass":"password", "msgid":"2281337"}',
        "desc":"Incorrect Identifiers."
    }
]