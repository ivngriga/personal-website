import React from 'react';

interface requestInfo {
    method?: string,
    url?: string,
    body?: BodyInit,
    headers?: HeadersInit
}

export class Req{
    reqInfo: requestInfo;
    response?: Response;


    constructor(method?:string, url?:string, body?:string|BodyInit, head?:string|HeadersInit){
        this.reqInfo={};

        this.setBody(body)
        this.setHead(head)
        this.setUrl(url)
        this.setMethod(method)
    }

    setMethod(method: string|undefined): void{
        this.reqInfo.method=method;
    }

    setUrl(url: string|undefined): void{
        this.reqInfo.url= url;
    }

    setBody(body:string|BodyInit|undefined) : void{
        this.reqInfo.body=typeof(body)=="string" ? JSON.parse(body) : body;
    }

    setHead(head:string|HeadersInit|undefined): void{
        this.reqInfo.headers=typeof(head)=="string" ? JSON.parse(head) : head;
    }

    async sendRequest(){
        if(this.reqInfo.method==="GET") this.reqInfo.body=undefined
        else this.reqInfo.body=JSON.stringify(this.reqInfo.body)
        if(!this.reqInfo.url) throw new Error('URL is not set');
        var response = await fetch(new URL(this.reqInfo.url), this.reqInfo);
        return await response.json();
    }
}