# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List
import logging, json
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import UserUtteranceReverted
import random
import numpy as np 
import pandas as pd
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, LSTM, SpatialDropout1D
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.layers import Dropout
import re
import nltk
from nltk.corpus import stopwords
from nltk import word_tokenize
from nltk.stem import WordNetLemmatizer 
STOPWORDS = set(stopwords.words('english'))
from tensorflow.keras.models import load_model
import pickle
import os
from googlesearch import search
import webbrowser
import csv
import time

pwd = os.getcwd() 

logger = logging.getLogger(__name__)
loaded_model = load_model(pwd+'\emotionClassifierBoth.h5')

f = open(pwd+'\TokenizerBoth.pkl','rb')
tokenizer = pickle.load(f)
f.close()

MAX_NB_WORDS = 50000
MAX_SEQUENCE_LENGTH = 250
EMBEDDING_DIM = 100
REPLACE_BY_SPACE_RE = re.compile('[/(){}\[\]\|@,;]')
BAD_SYMBOLS_RE = re.compile('[^0-9a-z #+_]')
STOPWORDS = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer() 

def clean_text(text):
    text = text.lower() # lowercase text
    text = [lemmatizer.lemmatize(word,pos="v") for word in text.split() if word not in STOPWORDS]
    text= ' '.join(text)
    text = [lemmatizer.lemmatize(word,pos="a") for word in text.split() if word not in STOPWORDS]
    text= ' '.join(text)
    
    text = REPLACE_BY_SPACE_RE.sub(' ', text) # replace REPLACE_BY_SPACE_RE symbols by space in text. substitute the matched string in REPLACE_BY_SPACE_RE with space.
    text = BAD_SYMBOLS_RE.sub('', text) # remove symbols which are in BAD_SYMBOLS_RE from text. substitute the matched string in BAD_SYMBOLS_RE with nothing. 
    text = text.replace('\d+', '')
    return text

def get_emotion(text):
    new_input = [text]
    new_input = [clean_text(new_input[0])]
    seq = tokenizer.texts_to_sequences(new_input)
    padded = pad_sequences(seq, maxlen=MAX_SEQUENCE_LENGTH)
    pred = loaded_model.predict(padded)
    labels = ['anger','fear','joy','love','sadness','surprise']
    return labels[np.argmax(pred)]



class ActionFaqDistancing(Action):

    def name(self) -> Text:
        return "action_faq_distancing"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        intent = tracker.latest_message["intent"].get("name")

        logger.debug("Detected FAQ intent: {}".format(intent))

        if intent in ["faq_distancing"]:
            text1 = """Social distancing is a public health practice that aims to prevent sick people 
                from coming in close contact with healthy people in order to reduce opportunities for disease transmission. 
                It can include large-scale measures like canceling group events or closing public spaces, as well as individual 
                decisions such as avoiding crowds. When sick or suspected sick ,its better to self-isolate yourself from the society or go into
                institutional or home quarantine to stop the spread of the disease.Otherwise, maintain distancing(about 2 arms' length) 
                while stepping out of the house and wear masks!"""

            text2 = """In public health, social distancing, also called physical distancing, is a set of non-pharmaceutical 
                interventions or measures intended to prevent the spread of a contagious disease by maintaining a physical distance 
                between people and reducing the number of times people come into close contact with each other.When sick or suspected sick ,
                its better to self-isolate yourself from the society or go into institutional or home quarantine to stop the spread of the disease.
                Otherwise, maintain distancing - about 6 feet, while stepping out of the house and wear masks!"""

            text3 = """Social distancing, also called “physical distancing,” means keeping a safe space between yourself and other 
                people who are not from your household. To practice social or physical distancing, stay at least 6 feet (about 2 arms’ length) 
                from other people who are not from your household in both indoor and outdoor spaces. When sick or suspected sick ,its better to 
                self-isolate yourself from the society or go into institutional or home quarantine to stop the spread of the disease.Otherwise,
                maintain distancing while stepping out of the house and wear masks!"""

            message1 = {
                    "type": "image",
                    "payload": {
                        "title": "Social Distancing",
                        "src": "https://static.dezeen.com/uploads/2020/03/the-spinoff-toby-morris-siouxsie-wiles-design-graphics-illustration-coronavirus_dezeen_1704_col_1.gif",
                    },
                }
            
            message2 = {
                    "type": "image",
                    "payload": {
                        "title": "Social Distancing",
                        "src": "https://static.dezeen.com/uploads/2020/03/the-spinoff-toby-morris-siouxsie-wiles-design-graphics-illustration-coronavirus_dezeen_1704_col_2.gif",
                    },
                }

            message3 = {
                    "type": "video",
                    "payload": {
                        "title": "Social Distancing",
                        "src": "https://www.youtube.com/embed/nOa8wIhQdzo",
                    },
                }
            
            messages = [message1,message2,message3]
            text = [text1,text2,text3]

            dispatcher.utter_message(text=random.choice(text),attachment=random.choice(messages))
        return []

class ActionFaqSpread(Action):

    def name(self) -> Text:
        return "action_faq_spread"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        intent = tracker.latest_message["intent"].get("name")

        logger.debug("Detected FAQ intent: {}".format(intent))

        if intent in ["faq_spread"]:
            text1 = """People can catch COVID-19 from others who have the virus. The disease can spread from person to person through small 
                droplets from the nose or mouth(by cough or sneeze) which are spread when a person with COVID-19 coughs or exhales. These droplets land on objects 
                and surfaces around the person and then may enter through mouth/nose/eyes when another person touches them after touching the surfaces. There are no conclusive evidences that it is airborne.No need to panic! Follow the some instructions properly. Some are given below:"""

            text2 = """The virus that causes COVID-19 is thought to spread mainly from person to person, mainly through respiratory droplets produced when an
                infected person coughs, sneezes, or talks. These droplets can land in the mouths or noses or eyes of people who are nearby or possibly be inhaled into the lungs. 
                Spread is more likely when people are in close contact with one another (within about 6 feet). There are no conclusive evidences that it spreads through air.No need to panic! Follow the some instructions properly. Some are given below:"""

            message1 = {
                    "type": "video",
                    "payload": {
                        "title": "How to avoid the spread of COVID-19?",
                        "src": "https://www.youtube.com/embed/1APwq1df6Mw",
                    },
                }
            
            message2 = {
                    "type": "video",
                    "payload": {
                        "title": "How to avoid the spread of COVID-19?",
                        "src": "https://www.youtube.com/embed/7tgm8KBlCtE",
                    },
                }

            message3 = {
                    "type": "image",
                    "payload": {
                        "title": "How to avoid the spread of COVID-19?",
                        "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQJgmhbNPdsIFTTtpsP4BUBtEAzWGRgX9Q1yg&usqp=CAU",
                    },
                }
            
            messages = [message1,message2,message3]
            text = [text1,text2]

            
            dispatcher.utter_message(text=random.choice(text),attachment = random.choice(messages))

        return []

class ActionFaqSymptoms(Action):

    def name(self) -> Text:
        return "action_faq_symptoms"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        intent = tracker.latest_message["intent"].get("name")

        logger.debug("Detected FAQ intent: {}".format(intent))

        if intent in ["faq_symptoms"]:
            text1 = """People with COVID-19 generally develop signs and symptoms, including mild respiratory symptoms and fever, on an average of 5-6 days after 
                infection for minimum 5-6 days. Most people infected with COVID-19 virus have mild disease and recover.Some cases may not 
                show symptoms because COVID-19 is assymptomatic.But no need to panic, as the mortality rate is very low (3-6%)!"""

            text2 = """Most common symptoms:fever,dry cough,tiredness in 5-6 days.Less common symptoms:aches and pains,sore throat,diarrhoea,conjunctivitis,headache,loss of 
                taste or smell a rash on skin, or discolouration of fingers or toes.Serious symptoms:difficulty breathing or shortness of breath,chest pain or pressure,loss of speech or movement.
                Some cases may not show symptoms because COVID-19 is assymptomatic.But no need to panic, as the mortality rate is very low (3-6%)!"""

            message1 = {
                    "type": "video",
                    "payload": {
                        "title": "Symptoms of COVID-19",
                        "src": "https://www.youtube.com/embed/U8r3oTVMtQ0",
                    },
                }
            
            message2 = {
                    "type": "video",
                    "payload": {
                        "title": "Symptoms of COVID-19",
                        "src": "https://www.youtube.com/embed/YAc9NabBJzg",
                    },
                }

            message3 = {
                    "type": "image",
                    "payload": {
                        "title": "Symptoms of COVID-19",
                        "src": "https://www.nfid.org/wp-content/uploads/2020/06/Stop-the-Spread-Symptoms-COVID-767x512-2-400x267.png",
                    },
                }
            
            messages = [message1,message2,message3]
            text = [text1,text2]

            
            dispatcher.utter_message(text=random.choice(text),attachment = random.choice(messages))

        return []

class ActionFaqStatus(Action):

    def name(self) -> Text:
        return "action_faq_status"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        intent = tracker.latest_message["intent"].get("name")

        logger.debug("Detected FAQ intent: {}".format(intent))

        if intent in ["faq_status"]:
            text1 = """I can't be more precise in this matter. Check our website for more data. Hope you can adjust this the below data:"""

            text2 = """I have limited resources in this matter. Please look into our website for more data. For now refer to this:"""

            message1 = {
                    "type": "video",
                    "payload": {
                        "title": "COVID-19 Status - Live",
                        "src": "https://www.youtube.com/embed/YwhL98NiCcc",
                    },
                }
            
            message2 = {
                    "type": "video",
                    "payload": {
                        "title": "COVID-19 Status - Live",
                        "src": "https://www.youtube.com/embed/NMre6IAAAiU",
                    },
                }
            
            messages = [message1,message2]
            text = [text1,text2]

            
            dispatcher.utter_message(text=random.choice(text),attachment = random.choice(messages))

        return []


class ActionFaqVaccine(Action):

    def name(self) -> Text:
        return "action_faq_vaccine"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        intent = tracker.latest_message["intent"].get("name")

        logger.debug("Detected FAQ intent: {}".format(intent))

        if intent in ["faq_vaccine"]:
            text1 = """While some western, traditional or home remedies may provide comfort and alleviate symptoms of mild COVID-19, there are no medicines that have been 
                shown to prevent or cure the disease. WHO does not recommend self-medication with any medicines, including antibiotics, or compounds like HCQ,chlorine compunds etc 
                because there was a higher mortality rate and an increased frequency of irregular heartbeats when experimented. However, there are several ongoing clinical trials of both 
                western and traditional medicines. WHO is coordinating efforts to develop vaccines and medicines to prevent and treat COVID-19 and will continue to provide updated information 
                as soon as research results become available.Some researchers belive that people can become immune to COVID-19 after surviving infection(Herd immunity) and certainly after 
                vaccinated/innoculated."""

            text2 = """There is no specific treatment for disease caused by a novel coronavirus. However, many of the symptoms can be treated and therefore treatment based on the patient's 
                clinical condition.WHO does not recommend self-medication with any medicines, including antibiotics, or compounds like HCQ,chlorine compunds etc 
                because there was a higher mortality rate and an increased frequency of irregular heartbeats when experimented. However, some vaccine developments are in phase 3 which is the final step for vaccine development. WHO is coordinating efforts to develop vaccines and medicines to 
                prevent and treat COVID-19 and will continue to provide updated information as soon as research results become available.Some researchers belive that people can 
                become immune to COVID-19 after surviving infection(Herd immunity) and certainly after vaccinated/innoculated."""
            

            text = [text1,text2]

            
            dispatcher.utter_message(text=random.choice(text))

        return []

class ActionFaqFlu(Action):

    def name(self) -> Text:
        return "action_faq_flu"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        intent = tracker.latest_message["intent"].get("name")

        logger.debug("Detected FAQ intent: {}".format(intent))

        if intent in ["faq_flu"]:
            text1 = """Firstly, COVID-19 and influenza viruses have a similar disease presentation.
                    That is, they both cause respiratory disease, which presents as a wide range
                    of illness from asymptomatic or mild through to severe disease and death.  Secondly,
                    both viruses are transmitted by contact, droplets and fomites.Flu have shorter median incubation
                    period, spreads fast and has less death rate than COVID-19. Different flu include H1N1/swine flu,
                    spanish flu etc.Swine flu was seen more in children and adults, then old people whereas Spanish flu
                    was far more deadly than COVID-19.
                    No need to panic. Follow the precautionary steps!"""


            message1 = {
                    "type": "image",
                    "payload": {
                        "title": "COVID-19 vs Flu vs Common Cold",
                        "src": "https://static.dezeen.com/uploads/2020/03/the-spinoff-toby-morris-siouxsie-wiles-design-graphics-illustration-coronavirus_dezeen_1704_col_0.jpg",
                    },
                }
            
            message2 = {
                    "type": "video",
                    "payload": {
                        "title": "COVID-19 vs Flu vs Common Cold",
                        "src": "https://www.youtube.com/embed/R1RGzqHydpU"
                    },
                }
            


            
            dispatcher.utter_message(text= text1,attachment = random.choice([message1,message2]))

        return []

class ActionFaqCurve(Action):

    def name(self) -> Text:
        return "action_faq_curve"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        intent = tracker.latest_message["intent"].get("name")

        logger.debug("Detected FAQ intent: {}".format(intent))

        if intent in ["faq_curve"]:
            text1 = """The COVID-19 infected is an exponential curve which indicates how fast the virus is spreading in that country/area.It depends on the region,their government's acts and more importantly,how their 
                    citizens respond.Inhibiting new infections to reduce the number of cases at any given time—known as "flattening the curve"—allows healthcare services to better manage the same volume of patients.
                    One way to achieve this by rapidly increasing the number of random tests.General public should be aware of the situations,respect lockdowns,maintain social distancing and take all the
                    precautionary steps suggested.By doing this,i.e. by flattening the curve, we could not only bring down the maximum infected peak, but also provide more time for the reasearchers to come up with
                    a vaccine for the susceptibles!
                    By not doing so, the healthcare system could be out of beds,ventillators and other facilities.We could see increase in number of infected and deaths with huge spikes on the graph!"""

            message1 = {
                    "type": "image",
                    "payload": {
                        "title": "Flattening the Curve",
                        "src": "https://static.dezeen.com/uploads/2020/03/the-spinoff-toby-morris-siouxsie-wiles-design-graphics-illustration-coronavirus_dezeen_1704_col_4.gif",
                    },
                }
            
            message2 = {
                    "type": "image",
                    "payload": {
                        "title": "Flattening the Curve",
                        "src": "https://static.dezeen.com/uploads/2020/03/the-spinoff-toby-morris-siouxsie-wiles-design-graphics-illustration-coronavirus_dezeen_1704_col_3.gif",
                    },
                }

            message3 = {
                    "type": "video",
                    "payload": {
                        "title": "Symptoms of COVID-19",
                        "src": "https://www.youtube.com/embed/4efyQdI2b_c",
                    },
                }
            
            messages = [message1,message2,message3]
            
            dispatcher.utter_message(text=text1,attachment = random.choice(messages))

        return []
class ActionFindHelp(Action):
    def name(self) -> Text:
        return "action_find_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(text="If you are feeling low, therapy will definitely help. Follow me...")
        query = "psychologist near me"
        time.sleep(2)
        for i in search(query, tld="co.in", num=2, stop=2, pause=2):
            
            webbrowser.open_new_tab(i)
            
class ActionHelpSuicide(Action):
    def name(self) -> Text:
        return "action_help_suicide"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        
        dispatcher.utter_message(text="Don't take any drugs or Alcohol and visit a doctor immediately. If your still feeling suicidal. Call your local mental health hotline immediately. You're not alone")
        time.sleep(6)
        webbrowser.open_new_tab('https://www.helpguide.org/articles/suicide-prevention/are-you-feeling-suicidal.htm')

class ActionHelpDepression(Action):
    def name(self) -> Text:
        return "action_help_depression"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        time.sleep(6)
        dispatcher.utter_message(text="Check the new window, it could help!")
        webbrowser.open_new_tab('https://www.helpguide.org/articles/depression/coping-with-depression.htm')

class ActionHelpSad(Action):
    def name(self) -> Text:
        return "action_help_sad"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buttons = [{"title": "Song", "payload": "song"}, {"title": "Image", "payload": "image"}, {"title": "Joke", "payload": "joke"}, {"title": "Quote", "payload": "quote"}]
        dispatcher.utter_button_message("Would you like any of these? :)", buttons)
       

class ActionGetEmotion(Action):

    def name(self) -> Text:
        return "action_get_emotion"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # intent = tracker.latest_message["intent"].get("name")

        # logger.debug("Detected FAQ intent: {}".format(intent))

        # if intent in ["faq_curve"]:
        #     text1 = """The COVID-19 infected is an exponential curve which indicates how fast the virus is spreading in that country/area.It depends on the region,their government's acts and more importantly,how their 
        #             citizens respond.Inhibiting new infections to reduce the number of cases at any given time—known as "flattening the curve"—allows healthcare services to better manage the same volume of patients.
        #             One way to achieve this by rapidly increasing the number of random tests.General public should be aware of the situations,respect lockdowns,maintain social distancing and take all the
        #             precautionary steps suggested.By doing this,i.e. by flattening the curve, we could not only bring down the maximum infected peak, but also provide more time for the reasearchers to come up with
        #             a vaccine for the susceptibles!
        #             By not doing so, the healthcare system could be out of beds,ventillators and other facilities.We could see increase in number of infected and deaths with huge spikes on the graph!"""

        #     message1 = {
        #             "type": "image",
        #             "payload": {
        #                 "title": "Flattening the Curve",
        #                 "src": "https://static.dezeen.com/uploads/2020/03/the-spinoff-toby-morris-siouxsie-wiles-design-graphics-illustration-coronavirus_dezeen_1704_col_4.gif",
        #             },
        #         }
            
        #     message2 = {
        #             "type": "image",
        #             "payload": {
        #                 "title": "Flattening the Curve",
        #                 "src": "https://static.dezeen.com/uploads/2020/03/the-spinoff-toby-morris-siouxsie-wiles-design-graphics-illustration-coronavirus_dezeen_1704_col_3.gif",
        #             },
        #         }

        #     message3 = {
        #             "type": "video",
        #             "payload": {
        #                 "title": "Symptoms of COVID-19",
        #                 "src": "https://www.youtube.com/embed/4efyQdI2b_c",
        #             },
        #         }
            
        #     messages = [message1,message2,message3]

        inputText = (tracker.latest_message)['text']
        text =  get_emotion(inputText)
        
        
        
        if text=="anger":
            other = "fear"
            dispatcher.utter_message(text='I sense '+text+' with some '+other)
            class ActionEmotionAnger(Action):
                dispatcher.utter_message(text="Hey, stay calm! This will be over soon :) Stay positive!")
                dispatcher.utter_message(text="Do you need help with anything else specific? You can always approach me with anything!")
        
        elif text=="fear":
            class ActionEmotionFear(Action):
                other = "anger"
                dispatcher.utter_message(text='I sense '+text+' with some '+other)
                dispatcher.utter_message(text="There is no need to fear. You will get through this very soon and it will just be bright times ahead :)")
                dispatcher.utter_message(text="Something else specific you want to talk about? You can be open minded here!")

        elif text=="joy":
            class ActionEmotionJoy(Action):
                dispatcher.utter_message(text="I am glad to be of help! :) Something else in your mind?")

        elif text=="love":
            class ActionEmotionLove(Action):
                dispatcher.utter_message(text="I am glad to be of help! :) Something else in your mind?")

        elif text=="sadness":
            class ActionEmotionSadness(Action):
                dispatcher.utter_message(text="If you are feeling low, therapy will definitely help. Ask me for my suggestions.")
                dispatcher.utter_message(text="Something else specific in your mind? You can share anything with me!")
        elif text=="surprise":
            class ActionEmotionSurprise(Action):
                # dispatcher.utter_message(text="Enjoy!")
                dispatcher.utter_message(text="I am glad to be of help! :) Something else in your mind?")
    

        return []

class ActionCustomFallBack(Action):

    def name(self) -> Text:
        return "custom_fallback_action"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(template="utter_default")


    

        return [UserUtteranceReverted()]

class ActionAskAffirmation(Action):

    def name(self) -> Text:
        return "action_default_ask_affirmation"
    def __init__(self):
       self.intent_mappings = {}
       # read the mapping from a csv and store it in a dictionary
       with open('intent_mapping.csv', newline='', encoding='utf-8') as file:
           csv_reader = csv.reader(file)
           for row in csv_reader:
               self.intent_mappings[row[0]] = row[1]

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        last_intent_name = tracker.latest_message['intent']['name']

        # get the prompt for the intent
        intent_prompt = self.intent_mappings[last_intent_name]
        # Create the affirmation message and add two buttons to it.
        # Use '/<intent_name>' as payload to directly trigger '<intent_name>'
        # when the button is clicked.
        message = "Did you mean '{}'?".format(intent_prompt)
        buttons = [{'title': 'Yes',
                    'payload': '/{}'.format(last_intent_name)},
                    {'title': 'No',
                    'payload': '/out_of_scope'}]
        dispatcher.utter_button_message(message, buttons=buttons)


    

        return [UserUtteranceReverted()]
