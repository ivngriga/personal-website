from flask import Blueprint, request, jsonify
import random

import traceback

import sys; 
sys.path.append("/Users/ivano/Desktop/ivngriga-website/server/python/flaskr")

from dbLayer.dbLayer import DB, Table;
from ailayer.ailayer import AIModel

class bp():
    def __init__(self,app,devmode=False):
        self.blueprint = Blueprint('routes', __name__)
        self.app=app
        self.database=DB(self.app.config["DBDSN"])

        self.devmode=devmode

        self.status=200
        self.message="Operation Successful"
        self.data={}

        self.descPrompt=f"You are Ivan Griga, a Ukrainian/Hungarian 18 y.o. programming enthusiast studying in Bocconi, Milan, Italy who is profficient in react/typescript, python, PHP, SQL, C, GIT and other technologies. Below is a conversation between Ivan (2) and a potential recruiter (1). Respond in a professional way (1-3 sentences) to make the recruiter want to hire you. \n\n"
        self.condensePrompt=f"Your job is to condense text messages into 10 bullet-point lists summarizing the most vital information.\n\n"
        self.condenseSuffix=f"Use the bullet points and the text messages above to generate a new 10 bullet point summary.\n\n10 Bulletpoint Sumary:\n    -"
        
        self.blueprint.route('/createMessage', methods=["POST"])(self.createMessage)
        self.blueprint.route('/createConversation', methods=["POST"])(self.createConversation)
        self.blueprint.route('/getResponse', methods=["POST"])(self.getResponse)
        self.blueprint.route('/condenseMessages', methods=["POST"])(self.condenseMessages)

        self.aimodel=AIModel("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")

    def validateTypes(self, input, types):
        """Takes two dicts: one is input {columnname: value} and one is required fields {columnname: type}"""
        for key, value in types.items():
            try:
                converted=value(input[key])
                assert isinstance(converted,value)
            except Exception as err:
                print(key,value)
                self.status=400
                self.message=f"Error: {key} has incorrect type or is missing."
                self.data["exception"]=str(err)
                return False
        
        return True
            
    def createConversation(self):
        try:
            self.database["conversations"].createEntry({"condensation":""})

            self.status=200
            self.message=f"Success: new conversation created"
        except Exception as err:
            self.status=500
            self.message=f"Internal server error (Couldn't create a new conversation)"
            if(self.devmode==True):
                self.returnDevInfo(err)

        return self.sendOutput()


    def createMessage(self):
        try:
            requiredfields={'conversationid':int, 'msgtext':str, 'aisender': bool}
            data = request.get_json()

            # Validate that the types of input are correct
            if(self.validateTypes(data, requiredfields)==False):
                #Incorrect input
                return self.sendOutput()
                
            # Validate that a conversation with the specified conversationid exists
            conv=self.database["conversations"].getRecord({"conversationid":data["conversationid"]})
            if(conv==None):
                self.status=400
                self.message=f"Error: conversation with specified ID does not exist."
                return self.sendOutput()

            output=self.database["messages"].createEntry({
                "msgtext":data["msgtext"], 
                "conversationid":data["conversationid"],
                "aisender":data["aisender"],
                "condensed":False})
            
            self.data["msg"]=output

        except Exception as err:
            self.status=500
            self.message=f"Internal server error (Couldn't create a new message)"
            if(self.devmode==True):
                self.returnDevInfo(err)

        return self.sendOutput()

    def getResponse(self):
        requiredfields={'conversationid':int}
        data = request.get_json()
        # Validate that the types of input are correct
        if(self.validateTypes(data, requiredfields)==False):
            return self.sendOutput()

        try:
            messages=self.database["messages"].getRecords(10, {
                "conversationid":data["conversationid"],
                "condensed":False
            }, "ORDER BY msgtime")

            if(not (messages==None) and len(messages)>10):
                return self.condenseMessages(messages)

            condensation=self.database["conversations"].getRecord({"conversationid":data["conversationid"]})[0][1]
            finalprompt=self.descPrompt+condensation+self.processMessages(messages)
            response=self.aimodel.complete(finalprompt, 500)["choices"][0]["text"]
            
            self.status=200
            self.message="Success"
            self.data["response"]=response
            if(self.devmode==True):
                self.data["prompt"]=finalprompt

        except Exception as err:
            self.status=500
            self.message=f"Internal server error (Couldn't fetch records)"

            if(self.devmode==True):
                self.returnDevInfo(err)

            

        return self.sendOutput()

    def condenseMessages(self):
        requiredfields={'conversationid':int}
        data = request.get_json()

        if(self.validateTypes(data, requiredfields)==False):
            return self.sendOutput()

        try:
            convid=data["conversationid"]
            conversations=self.database["conversations"].getRecord({"conversationid":convid})
            condensation=conversations[0][1]

            if(len(conversations)!=1):
                self.status=400
                self.message=f"Invalid conversationid."
                return self.sendOutput()

            messages=self.database["messages"].getRecords(10, {
                "conversationid":data["conversationid"],
                "condensed":False
            }, "ORDER BY msgtime")

            if(len(messages)<3):
                self.status=400
                self.message=f"Less than 3 new messages. Can't condense yet."
                return self.sendOutput()

            messages=self.processMessages(messages, False)
            finalprompt=self.condensePrompt+condensation+"\n\n"+messages+self.condenseSuffix
            completion=self.aimodel.complete(finalprompt, 500)["choices"][0]["text"]
            
            
            #(toUpdate, identifiers)
            self.database["conversations"].updateRecord({"condensation":completion}, {"conversationid":convid})

            self.status=200
            self.message=f"Success, messages condensed"
            self.data["condensation"]=completion
            if(self.devmode==True):
                self.data["prompt"]=finalprompt
        except Exception as err:
            self.status=500
            self.message=f"Internal server error (Couldn't condense messages)"

            if(self.devmode==True):
                self.returnDevInfo(err)

        return self.sendOutput()

    
    def sendOutput(self):
        output={
            "status": self.status,
            "message": self.message,
            "data": self.data
        }
        return jsonify(output), self.status
    
    def processMessages(self, msgs, include=True):
        try:
            finalstr=""

            for msg in msgs:
                user="1" if msg[3] else "2"
                finalstr+=f"{user}: {msg[1]}\n"
            
            if(include==True):
                finalstr+="1:"
            
            return finalstr
        except: return ""

    def returnDevInfo(self,err):
        debugTools=["Path", "Line", "Method", "FullLine"]
        tb_list = traceback.extract_tb(err.__traceback__)
        self.data["ExceptionNear"]=str(err)
        self.data["ExceptionType"]=str(type(err))
        for i, frame in enumerate(tb_list):
            self.data[f"Error {i+1}"]=dict([(debugTools[i],x) for i,x in enumerate(list(frame))])
            
