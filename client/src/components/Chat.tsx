import React, {useState, useRef, useEffect} from 'react';
import {Req} from './RequestClass';
import Cookies from 'js-cookie';

import './css/Chat.css';

interface Message {
    msg: string;
    aisender: boolean;
}



const AIChat: React.FunctionComponent = () => {
    const [curChat, setCurChat] = useState(-1)
    const [curChats, setCurChats] = useState(getChats())
    const [messages, setMessages] = useState<Message[]>([])
    const MCRef = useRef(null);

    console.log(messages)
 

    //const curChatID=curChat===-1 ? -1 : curChats[curChat]
    const curChatStr= curChat===-1 ? "No Chat Selected" : "Chat "+(curChat+1);

    useEffect(() => {
        if (MCRef && MCRef.current) {
            const MCHTMLELEM=(MCRef.current as HTMLElement)
            MCHTMLELEM.scrollTop = MCHTMLELEM.scrollHeight;
        }
    }, [messages]);

    //http://127.0.0.1:5000/getMessages?limit=10&conversationid=5853870

    return (
        <div className="ChatCont FlexRow">
            <div className="ViewChats FlexCol">
                <div className="ChatViewHeading HideOverflow">Your Chats:</div>
                {curChats.map( (item, index) => {
                    return (
                        <div key={index.toString()} className="ChatSelector" onClick={()=>selectChat(index)}>
                            <div className="HideOverflow">Chat {index+1}</div>
                        </div>
                    )
                })}
                <div className="ChatSelector StartNewChat" onClick={startNewChat}>
                    <div className="HideOverflow">Start New Chat</div>
                </div>

                <div className="ChatSelector ClearChats" onClick={clearChats}>
                    <div className="HideOverflow">Clear Chats</div>
                </div>
                
            </div>

            <div className="SelectedChat FlexColumn">
                <div className="ChatHeading"> {curChatStr} </div>
                <div className="ChatMessages" ref={MCRef}>
                    {messages.map((item)=>{
                        var prefix="You:"
                        var userClass="UserSent"
                        console.log(item)
                        
                        // Convert aisender to a bool in case it is a string
                        var aisender:boolean=typeof item["aisender"] == "string" ? (item["aisender"]=="False" ? false : true) : item["aisender"]

                        if(aisender){
                            prefix="IvanAI:"
                            userClass="AISent"
                        }
                        
                        const msg=item.msg.trimStart().trimEnd()
                        
                        
                        return (
                            <div className={"MsgContainer "+userClass}>
                                <b className={"prefix"+userClass}>{prefix}</b>
                                {msg.split("\n").map((item,index)=>{
                                    return <p key={index.toString()}>{item}</p>
                                })}
                            </div>
                        )
                    })}
                </div>
                <div className="FlexRow ChatEntry"><InputText convid={parseInt(curChats[curChat])} appendMsg={appendMsg}/></div>
            </div>
        </div>
    )

    async function selectChat(index:number){
        setCurChat(index)
        setMessages([])
        console.log(curChats)
        const msgs:Array<Array<any>>=await getMsgs(parseInt(curChats[index]));
        setMessages(msgs.map(function(msg) {
            return {msg:msg[1],aisender:msg[3]}
        }))

    }

    async function startNewChat(){
        // Create instance of custom request class (Easier to make complicated functions)
        var request=new Req();

        // Make a request to create a new convo
        request.setUrl("http://127.0.0.1:5000/createConversation");
        request.setBody("{}");
        request.setHead('{"Content-Type": "application/json"}');
        request.setMethod("POST");

        const response=await request.sendRequest(); // Returns a json object
        console.log(response)
        const convid=response["data"]["conversation"]["conversationid"];

        console.log(convid)
        
        // Set the cookies to include the newly created conversation and reassign user to it
        var curstr=Cookies.get('conversations');
        curstr=curstr ? curstr+"," : "";
        Cookies.set('conversations', curstr+convid);

        // Update this components info
        setCurChats(getChats())
        setCurChat(curChats.length)

        setMessages(await getMsgs(convid))
    }

    function clearChats(){
        Cookies.set('conversations', '');

        setMessages([])
        setCurChats(getChats())
        setCurChat(-1)
    }

    function getChats(){
        const cookieStr=Cookies.get('conversations');
        return cookieStr ? cookieStr.split(",") : [];
    }

    async function getMsgs(convid: number){

        var request=new Req();

        console.log(convid)
        // Make a request to create a new convo
        request.setUrl("http://127.0.0.1:5000/getMessages?limit=30&conversationid="+convid+"&asc=DESC");
        request.setBody("{}");
        request.setHead('{"Content-Type": "application/json"}');
        request.setMethod("GET");

        const response=await request.sendRequest(); // Returns a json object

        var msgs=response["data"]["messages"]
        console.log(msgs)
        if(msgs) msgs.reverse() 
        else msgs=[]
        return msgs
        
    }

    function appendMsg(msg:string, aisender:boolean){
        if(msg!=undefined && aisender!=undefined){
            const msgfinal={msg:msg, aisender:aisender}
            var tempmsgs=messages
            tempmsgs.push(msgfinal)
            console.log(tempmsgs)
            setMessages([...tempmsgs])
        }
        
    }
}

export default AIChat

const InputText: React.FunctionComponent<{convid:number, appendMsg:Function}> = ({convid, appendMsg}) => {
    const [textAreaValue, setTextAreaValue] = useState("")
    const [gettingResponse, setGettingResponse] = useState(false)

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const displayArea = Number.isNaN(convid)? 'none':'block';


    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleInput = () => {
        if(textAreaRef.current) {
            textAreaRef.current.style.height='100%';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
            
        }
    }

    async function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.key === 'Enter' && !e.shiftKey) {
            const textareaval=textAreaValue
            setTextAreaValue("")
            const msgSent=await SendMsg(textareaval)
            if(msgSent){
                appendMsg(
                    msgSent["data"]["msg"]["msgtext"],
                    msgSent["data"]["msg"]["aisender"]
                )
                
                if(!gettingResponse){
                    setTimer(setTimeout(()=>timeoutFunc(), 5000));
                    
                }
                setGettingResponse(true)
            } else setTextAreaValue(textareaval)
            if(e.preventDefault) e.preventDefault();
            if(textAreaRef.current) {
                textAreaRef.current.style.height='100%';
            }
        }
        
        if(timer) {
            clearTimeout(timer)
            setTimer(setTimeout(()=>timeoutFunc(), 5000));
        }   
    }

    async function timeoutFunc(){
        // Tell user that AI is generating response
        setTextAreaValue("IvanAI is typing...")
        if(textAreaRef.current) textAreaRef.current.disabled=true
        if(btnRef.current) btnRef.current.disabled=true

        // generate resp
        const resp = await getResponse()
        setGettingResponse(false)

        // append msg to messages and to server
        SendMsg(resp, true)
        appendMsg(resp,true)

        // Reset the inputs
        setTextAreaValue("")
        if(textAreaRef.current) textAreaRef.current.disabled=false
        if(btnRef.current) btnRef.current.disabled=false
        // reset the timer after user didn't type anything for 5 secs
        setTimer(null)

    }

    async function getResponse(){
        var request=new Req();
        request.setUrl("http://127.0.0.1:5000/getResponse");
        console.log(convid)
        const obj={
            'conversationid':convid,
            'modelid':4298623
        }

        request.setBody(JSON.stringify(obj));
        request.setHead({'Content-Type': 'application/json'});
        request.setMethod("POST");

        const response=await request.sendRequest(); // Returns a json object
        if(response["status"]==200){
            return response["data"]["response"]
        } else {
            return false
        }

    }

    return (
        <div className='InputContainer'>
            <textarea 
                ref={textAreaRef} 
                onKeyDown={(e)=>{
                    handleKeyDown(e);
                }} 
                onChange={(e)=>{
                    setTextAreaValue(e.target.value)
                }}
                onInput={handleInput} 
                rows={1}
                style={{display: displayArea}}
                value={textAreaValue}
            ></textarea>
            <button className='SendMessageBtn' ref={btnRef} onClick={(e)=>{
                e.preventDefault();
                handleKeyDown({key: "Enter", shiftKey: false} as React.KeyboardEvent<HTMLTextAreaElement>);
            }} style={{display: displayArea}}>={'>'}</button>
        </div>
        
    )

    async function SendMsg(msg:string, aisender:boolean=false){
        if(msg.length==0 || msg==undefined || aisender==undefined) return false
        else {
            var request=new Req();
            // Make a request to create a new convo
            request.setUrl("http://127.0.0.1:5000/createMessage");

            const obj={
                'conversationid':convid,
                'msgtext':msg,
                'aisender': aisender
            }

            request.setBody(JSON.stringify(obj));
            request.setHead({'Content-Type': 'application/json'});
            request.setMethod("POST");

            const response=await request.sendRequest(); // Returns a json object
            console.log(response)
            if(response["status"]==200){
                return response
            } else {
                return false
            }
        }
    }
}