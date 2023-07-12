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

        self.descPrompt=f"You are Ivan Griga (1), a Ukrainian/Hungarian 18 y.o. programming enthusiast studying in Bocconi, Milan, Italy who is profficient in react/typescript (1.5yrs), python (4yrs), PHP (2yrs), SQL (2yrs), C (0.5yrs), GIT (2yrs) and other technologies. Below is an instagram conversation between Ivan (1) and a stranger (2)."
        self.descSuffix=f"Respond in 1 sentence."
        
        self.condensePrompt=f"Below is a conversation between you (1) and a stranger (2) Transform the text conversation below into a concise bullet-point list, summarizing the most important information and key takeaways about 1 and 2.\n\n"
        self.condenseSuffix=f"\n\nSummary:\n"

        self.condenseBulletPrompt=f"Below are two sets of lists that you must combine into a single list containing the most vital information from both lists.\n\n"
        self.condenseBulletSuffix=f"\n\nSummary:\n"
        
        # required fields for createMessage {'conversationid':int, 'msgtext':str, 'aisender': bool}
        self.blueprint.route('/createMessage', methods=["POST"])(self.createMessage)

        # required fields for createConversation {}
        self.blueprint.route('/createConversation', methods=["POST"])(self.createConversation)

        # required fields for createModel {'promptPrefix':str, 'promptSuffix':str}
        self.blueprint.route('/createModel', methods=["POST"])(self.createModel)

        # required fields for getResponse {'conversationid':int, 'modelid':int}
        self.blueprint.route('/getResponse', methods=["POST"])(self.getResponse)

        # required fields for condenseMessages {'conversationid':int}
        self.blueprint.route('/condenseMessages', methods=["POST"])(self.condenseMessages)

        # required fields for getMessages {'conversationid':int, 'limit':int}
        self.blueprint.route('/getMessages', methods=["GET"])(self.getMessages)

        self.aimodel=AIModel("<OPENAI API KEY HERE>")

    def createModel(self):
        try:
            requiredfields={'promptPrefix':str, 'promptSuffix':str}
            data = request.get_json()
            
        except Exception as err:
            self.status=400
            self.message=f"Failed Parsing Json Body"
            if(self.devmode==True):
                self.returnDevInfo(err)

            return self.sendOutput()

        if(self.validateTypes(data, requiredfields)==False):
            #Incorrect input
            self.status=400
            self.message=f"Error: param(s) have incorrect type or are missing."

            if(self.devmode==True):
                self.returnDevInfo(err)

            return self.sendOutput()

        try:
            model=self.database["models"].createEntry({
                "promptPrefix":data["promptPrefix"],
                "promptSuffix":data["promptSuffix"]
            })
            self.data["model"]=model
            self.status=200
            self.message=f"Success: new model created"
        except Exception as err:
            self.status=500
            self.message=f"Internal server error (Couldn't create a new conversation)"
            if(self.devmode==True):
                self.returnDevInfo(err)

        return self.sendOutput()
    
    def getMessages(self):

        requiredfields={'conversationid':int, 'limit':int}

        convid = request.args.get('conversationid')
        limit = request.args.get('limit')

        if(self.validateTypes({'conversationid':convid, "limit":limit}, requiredfields)==False):
            self.status=400
            self.message=f"Limit/Conversation ID not present/invalid"
            return self.sendOutput()

        asc = request.args.get('asc')
        if(asc==None):
            asc="ASC"

        # Validate that a conversation with the specified conversationid exists
        conv=self.database["conversations"].getRecord({"conversationid":int(convid)})
        if(conv==None):
            self.status=400
            self.message=f"Error: conversation with specified ID does not exist."
            return self.sendOutput()

        messages=self.database["messages"].getRecords(limit, {
            "conversationid":int(convid),
        }, " ORDER BY msgtime "+asc)

        self.status=200
        self.message=f"Success, messages retrieved."
        self.data["messages"]=messages
        return self.sendOutput()

    def validateTypes(self, input, types):
        """Takes two dicts: one is input {columnname: value} and one is required fields {columnname: type}"""
        for key, value in types.items():
            try:
                converted=value(input[key])
                assert isinstance(converted,value)
            except Exception:
                return False
        
        return True
            
    def createConversation(self):
        try:
            conversation=self.database["conversations"].createEntry({"condensation":""})
            self.data["conversation"]=conversation
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
            
        except Exception as err:
            self.status=400
            self.message=f"Failed Parsing Json Body"
            if(self.devmode==True):
                self.returnDevInfo(err)

            return self.sendOutput()

        # Validate that the types of input are correct
        if(self.validateTypes(data, requiredfields)==False):
            #Incorrect input
            self.status=400
            self.message=f"Error: param(s) have incorrect type or are missing."

            if(self.devmode==True):
                self.returnDevInfo(err)

            return self.sendOutput()


        try:
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
        requiredfields={'conversationid':int, 'modelid':int}
        data = request.get_json()
        # Validate that the types of input are correct
        if(self.validateTypes(data, requiredfields)==False):
            self.status=400
            self.message=f"Error: param(s) have incorrect type or are missing."
            return self.sendOutput()

        convRecords=self.database["messages"].getRecords(15, {"conversationid":data["conversationid"], "condensed":False})

        if((not convRecords==None) and (not convRecords==False) and (len(convRecords)>=10)):
            self.condenseMessages(False)

        
        messages=self.database["messages"].getRecords(7, {
            "conversationid":int(data["conversationid"]),
        }, "ORDER BY msgtime DESC")

        if(not messages==None):
            messages=reversed(messages)

        model=self.database["models"].getRecord({"modelid":int(data["modelid"])})[0]
        condensation=self.database["conversations"].getRecord({"conversationid":int(data["conversationid"])})[0][1]
        finalprompt=model[1]+"\n\nPast conversation summary:\n"+condensation+self.processMessages(messages, False)+"\n\n"+model[2]+"\n\n1:"
        print(finalprompt)
        response=self.aimodel.complete(finalprompt, 256, 1.3, 1.5)["choices"][0]["text"]
        
        self.status=200
        self.message="Success"
        self.data["response"]=response
        if(self.devmode==True):
            self.data["prompt"]=finalprompt

            

        

            

        return self.sendOutput()

    def condenseMessages(self, toReturn=False):
        requiredfields={'conversationid':int}
        data = request.get_json()

        if(self.validateTypes(data, requiredfields)==False):
            if(toReturn):
                self.status=400
                self.message=f"Error: param(s) have incorrect type or are missing."
                return self.sendOutput()
            else:
                return False

        
        convid=data["conversationid"]

        conversations=self.database["conversations"].getRecord({"conversationid":int(convid)})
        condensation=conversations[0][1]

        if(len(conversations)!=1):
            if(toReturn):
                self.status=400
                self.message=f"Invalid conversationid."
                return self.sendOutput()
            else:
                return False


        messages=self.database["messages"].getRecords(10, {
            "conversationid":int(convid),
            "condensed":False
        }, "ORDER BY msgtime")

        if(len(messages)<3):
            if(toReturn):
                self.status=400
                self.message=f"Less than 3 new messages. Can't condense yet."
                return self.sendOutput()
            else:
                return False
                
        try:
            messages=self.processMessages(messages, False)
            finalprompt=self.condensePrompt+messages+self.condenseSuffix
            print(finalprompt)
            completion=self.aimodel.complete(finalprompt, 256, 0.1, 0.1)["choices"][0]["text"]

            if(not condensation==""):
                finalprompt=self.condenseBulletPrompt+"Summary 1:\n"+condensation+"\n\nSummary 2:\n"+completion+self.condenseBulletSuffix
                completion=self.aimodel.complete(finalprompt, 256, 0.1, 0.1)["choices"][0]["text"]

            
            #(toUpdate, identifiers)
            self.database["conversations"].updateRecords({"condensation":completion}, {"conversationid":int(convid)})
            self.database["messages"].updateRecords({"condensed":True}, {"conversationid":int(convid)})

            if(toReturn):
                self.status=200
                self.message=f"Success, messages condensed"
                self.data["condensation"]=completion
                if(self.devmode==True):
                    self.data["prompt"]=finalprompt
            else:
                return True

            
        except Exception as err:
            if(toReturn):
                self.status=500
                self.message=f"Internal server error (Couldn't condense messages)"

                if(self.devmode==True):
                    self.returnDevInfo(err)
            else:
                return False

        return self.sendOutput()

    
    def sendOutput(self):
        output={
            "status": self.status,
            "message": self.message,
            "data": self.data
        }
        self.data={}
        return jsonify(output), self.status
    
    def processMessages(self, msgs, include=True):
        try:
            finalstr=""
            
            for msg in msgs:
                print(msg)
                user="1" if msg[3] else "2"
                finalstr+=f"{user}: {msg[1]}\nSent at:"+str(msg[4])+"\n"
                print(finalstr)
            
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
            
