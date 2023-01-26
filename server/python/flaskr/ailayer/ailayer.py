import os
import openai

class AIModel():
    def __init__(self,apikey):
        openai.api_key = apikey
        

    def complete(self,prompt, maxtokens):
        completion=openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=maxtokens,
            temperature=0
        )
        return completion
