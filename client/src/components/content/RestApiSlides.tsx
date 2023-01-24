import { hashString } from '../Hashing';
import React, {useState} from 'react';

import  '../css/RestApiSlides.css';
import {Slide2Radios, Slide3Radios, Slide4Radios, APIRadios} from './RestApiRadios'

export interface IData{
    username?: string,
    password?: string,
    messages?: Array<string>
}

interface slideProps{
    updateFunction: Function,
    data?: IData,
    children?: React.ReactElement;
}

interface requestInfo {
    method: string,
    body?: string,
    headers?: any
}

export const Slide1: React.FunctionComponent<slideProps> = ({updateFunction, data}) => {
    
    return (
        <div className="SlideContainer">
            <div className="SlideBody">
                To test the rest api, you must first enter a username and password. Then you will be able to use presets or generate custom requests inside this widget to interact with/test the api.
            </div>
            

            <div className="SlideFooter">
                
            <UsernameForm updateFunction={updateFunction} data={data}>
                <div className="SlideNumber">
                    You are on slide 1/{AllSlides.length}.
                </div>
            </UsernameForm>

                
            </div>

            
            
        </div>
    )
}

export const Slide2: React.FunctionComponent<slideProps> = ({updateFunction, data}) => {

    return (
        <div className="SlideContainer">
            <div className="SlideHeader">
                <button className="GoBackButton" onClick={()=>goBack()}>Go Back</button>
                <div className="HeaderTextContainer">
                    <div className="HeaderText"><b>Your username:</b> {data?.username}</div> 
                    <div className="HeaderText"><b>Your password hash:</b> {data?.password}</div> 
                </div>
                
            </div>

            <div className="SlideBody">
                Firstly, the public scope. Use the selectors/input fields below to test the public REST API.
                

                <ApiConstructor updateFunction={updateFunction}  data={data} radios={Slide2Radios}/>
                
                
            </div>

            <div className="SlideFooter">
                <div>
                    <button className="ButtonForm" onClick={handleSubmit}>Continue</button>
                </div>
                

                <div className="SlideNumber">
                    You are on slide 2/{AllSlides.length}.
                </div>
            </div>
            
        </div>
    )

    function handleSubmit(){
        updateFunction({
            username: data?.username,
            password: data?.password,
            messages: data?.messages
        }, 2);
    }

   

    function goBack(){
        updateFunction({
            username: data?.username,
            password: data?.password,
            messages: data?.messages
        }, 0);
    }
}

export const Slide3: React.FunctionComponent<slideProps> = ({updateFunction, data}) => {
    const disabled = data?.messages===undefined ? true : false;
    console.log(data?.messages===undefined);

    return (
        <div className="SlideContainer">
            <div className="SlideHeader">
                <button className="GoBackButton" onClick={()=>goBack()}>Go Back</button>
                <div className="HeaderTextContainer">
                    <div className="HeaderText"><b>Your username:</b> {data?.username}</div> 
                    <div className="HeaderText"><b>Your password hash:</b> {data?.password}</div> 
                </div>
                
            </div>

            <div className="SlideBody">
                Next, the private scope. Use the selectors/input fields below to test the private create message function of the REST API (Create a message using the first template to proceed)
                

                <ApiConstructor updateFunction={updateFunction} data={data} radios={Slide3Radios}/>
                
                
            </div>

            <div className="SlideFooter">
                <div>
                <button disabled={disabled} className="ButtonForm" onClick={handleSubmit}>Continue</button>
                </div>
                
                <div className="SlideNumber">
                    You are on slide 3/{AllSlides.length}.
                </div>
            </div>
        </div>
    )

    function goBack(){
        updateFunction({
            username: data?.username,
            password: data?.password,
            messages: data?.messages
        }, 1);
    }

    function handleSubmit(){
        updateFunction({
            username: data?.username,
            password: data?.password,
            messages: data?.messages
        }, 3);
    }
}

export const Slide4: React.FunctionComponent<slideProps> = ({updateFunction, data}) => {
    return (
        <div className="SlideContainer">
            <div className="SlideHeader">
                <button className="GoBackButton" onClick={()=>goBack()}>Go Back</button>
                <div className="HeaderTextContainer">
                    <div className="HeaderText"><b>Your username:</b> {data?.username}</div> 
                    <div className="HeaderText"><b>Your password hash:</b> {data?.password}</div> 
                </div>
                
            </div>

            <div className="SlideBody">
                Finally, deleting messages. Use the selectors/input fields below to test the private delete message function of the REST API.

                <ApiConstructor updateFunction={updateFunction} data={data} radios={Slide4Radios}/>
            </div>

            <div className='SlideFooter'>
                <div className="SlideNumber">
                    You are on slide 4/{AllSlides.length}.
                </div>
            </div>
        </div>
    )

    function goBack(){
        updateFunction({
            username: data?.username,
            password: data?.password,
            messages: data?.messages
        }, 2);
    }
}

const UsernameForm: React.FunctionComponent<slideProps> = ({updateFunction, data, children}) => {
    const [username, setUsername] = useState(data?.username || "");
    const [password, setPassword] = useState("");
    const [pfDisabled, setPF] = useState(true);
    const [errorMSG, setErrorMSG] = useState("");

    const buttonText = pfDisabled ? "Get Password" : "Continue";

    var usernameRegex = /^[a-zA-Z0-9]+$/;
    var passwordRegex = /^[a-zA-Z0-9#?!@$%^&*-]+$/;

    return(
        <div className="GlobalContainer">
        <form className='UsernameForm'>
            <div className="ErrorMessage">
                {errorMSG}
            </div>
            <div className="InputContainer">
                <div className="TextContainer">
                    <label>
                        Enter any username:
                    </label>
                    <input type="text" className="UsernameInput InputForm" value={username} onChange={(event)=>setUsername(event.target.value)}></input>
                </div>

                <div className="TextContainer">
                    <label>
                        Your temporary password:
                    </label>
                    <input type="text" className="GeneratedPassword InputForm" value={password} disabled={pfDisabled} onChange={(event)=>setPassword(event.target.value)}></input>
                </div>
            </div>
        </form>

        <div className="FlexRow">
            <button type='submit' className="ButtonForm" onClick={handleSubmit}> {buttonText} </button>

            {children}
        </div>
        </div>
    )

    async function handleSubmit(event: React.FormEvent<HTMLButtonElement>){
        if(buttonText=="Get Password"){
            if(username.length==0){
                setErrorMSG("Username Field must be Non-Empty");
            } else {
                if(usernameRegex.test(username)==false){
                    setErrorMSG("Username may only contain alphanumericals.")
                } else {
                    var len=8-username.length;
                    if(len<3) len=3;
                    const password=username+Array.from({length:len},(v,k)=>k+1).join("");
                    setErrorMSG("")
                    setPF(false);
                    setPassword(password);
                }
            }
            
        } else {
            if(password.length<8){
                setErrorMSG("Password must be at least 8 characters");
            } else {
                setErrorMSG("")

                if(usernameRegex.test(username)==false){
                    setErrorMSG("Username may only contain alphanumericals.")
                } else if (passwordRegex.test(password)==false){
                    setErrorMSG("Password contains forbidden characters.")
                } else {
                    let response=commitUserData(username, password);
                    let resp=await response.finally();

                    console.log(resp);

                    if(resp["Status"]==200){
                        const hash = hashString(username+password);
                        updateFunction({
                            username: username,
                            password: hash,
                            messages: data?.messages
                        }, 1);
                        
                    } else {
                        setErrorMSG("This username already exists. Enter correct password or different username.")
                    }
                }
            }
        }
        
    }

    async function commitUserData(username: string, password: string){
        const hash = hashString(username+password);
        const data = {usrname: username.toString(), usrpass: hash.toString()};
        const response = await fetch("http://localhost:8000/api/usr/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {}
        });

        const resp=await response.json();
        
        return resp;

        
    }
}

const ApiConstructor: React.FunctionComponent<{updateFunction: Function, radios: Array<APIRadios>, data?: IData}> = ({updateFunction, radios, data}) => {
    const [url, setURL] = useState(radios[0].url)
    const [method, setMethod] = useState(radios[0].method)
    const [headers, setHeaders] = useState(radios[0].headers)
    const [body, setBody] = useState(radios[0].body.replaceAll("username", data?.username || "").replaceAll("password", data?.password || "").replaceAll("messageid", data?.messages!==undefined&&data?.messages.length>0 ? JSON.parse(data?.messages[0])["msgid"] : ""))
    const [desc, setDesc] = useState(radios[0].desc);

    const [errorMSG, setErrorMSG] = useState("");
    const [response, setResponse] = useState("");
    

    return (
        <div className="FlexColumn">
            <div className="ErrorMessage">
                {errorMSG}
            </div>

            <div className="FlexRow">
                <div className="RadioSelector">
                    {radios.map((item, index)=>{
                        return (<div key={index.toString()} className="RadioButton" onClick={()=>setValues(item)}>{index+1}</div>)
                    })}
                    
                </div>

                <div className="RadioDescription">Description: {desc}</div>
            </div>
            

            <div className="InputFields">
                <div className="TextContainer">
                    <label>
                        Enter url:
                    </label>
                    <input type="text" name="url" value={url} onChange={(event)=>setURL(event.target.value)}></input>
                </div>

                <div className="TextContainer">
                    <label>
                        Enter method:
                    </label>
                    <input type="text" name="method" value={method} onChange={(event)=>setMethod(event.target.value)}></input>
                </div>

                <div className="TextContainer">
                    <label>
                        Enter Headers:
                    </label>
                    <input type="text" name="headers" value={headers} onChange={(event)=>setHeaders(event.target.value)}></input>
                </div>

                <div className="TextContainer">
                    <label>
                        Enter Body:
                    </label>
                    <input type="text" name="body" value={body} onChange={(event)=>setBody(event.target.value)}></input>
                </div>
            </div>

            
            <button className="ButtonForm" onClick={()=>makeRequest()}>Submit Request</button>

            <textarea disabled className="ResponseTextArea" value={response} rows={4}></textarea>
    </div>
    )

    function setValues(values: APIRadios){


        setURL(values.url);
        setMethod(values.method);
        setHeaders(values.headers);
        setBody(values.body.replaceAll("username", data?.username || "").replaceAll("password", data?.password || "").replaceAll("messageid", data?.messages!==undefined && data?.messages.length>0 ? JSON.parse(data?.messages[0])["msgid"] : ""));
        setDesc(values.desc);
    }

    async function makeRequest(){
        

        let reqInfo : requestInfo = {method: method}
        if(method=="POST"){
            try{
                let parsedBody=JSON.parse(body);
                reqInfo.body=JSON.stringify(parsedBody);
                reqInfo.headers=JSON.parse(headers)
            } catch(err){
                setErrorMSG("Failed to parse headers/body to json.")
            }
        }

        

        try{
            setErrorMSG("")

            const response = await fetch(url, reqInfo);
            
            if (!response.ok) {
                
                const error = await response.text();
                setResponse(error)
            } else {
                const resp = (await response.json());
                var messages = data?.messages;
                if(resp["msg"]){
                    if(messages===undefined){
                        messages=[];
                    }
                    messages.push(resp["msg"]);
                }

                if(resp["Message"]=="Message deleted" && messages!==undefined && messages.length!=0){
                    messages?.shift()
                    setErrorMSG("You deleted a message. Update the body by clicking 1 below to delete a different one or change the body manually.")
                }
                
                
                setResponse(JSON.stringify(resp, null, "    "));
                updateFunction({
                    username: data?.username,
                    password: data?.password,
                    messages: messages
                });

                
            }
        } catch (err) {
            console.log(err);
            setErrorMSG("Failed to fetch, no response from server")
        }
        
        
        
    }
}

export const AllSlides = [Slide1, Slide2, Slide3, Slide4];