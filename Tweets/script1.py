# coding: utf-8

import tweepy
import json
import pandas as pd
from langdetect import detect
from datetime import datetime 
from datetime import timedelta

consumer_key = "cFf7im7BH68xO9qh3zEsv3nFz"
consumer_secret = "2QyodEVK63XYE5D9RFPAo0I53rhBOsNocQGpGB8rapmEqxDnJi"
access_key = "1265319352795975680-EJBIU55ZHZnjn8svR420cqVuU9evRL"
access_secret = "i8h2utF6b2l2Uh7Vpg6c2mnPOO1CuthGdbyWtHSWdIURP"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret) 
auth.set_access_token(access_key, access_secret) 
api = tweepy.API(auth) 


screenname = ["narendramodi","WHO","CDCgov","COVID19CA","CovidIndiaSeva","UK COVID-19","COVID19_USA_","ashishkjha","COVIDNewsByMIB","MoHFW_INDIA"]

tweet,tweets_dates,text_query,hyperlinks,screennames_twitter,profile_pic = [], [], ["CORONA","COVID"], [], [], []

count = 0
for i in screenname:
    tweets = api.user_timeline(screen_name=i,count=100,tweet_mode="extended")  
    for status in tweets:
        for text in text_query:
            if text in status.full_text and detect(status.full_text)=="en" and "RT" not in status.full_text:
                tweet.append(status.full_text)
                tweets_dates.append(status.created_at)
                screennames_twitter.append('@'+status.user.screen_name)
                profile_pic.append(status.user.profile_image_url)
                if len(status.entities['urls']) >0:
                    hyperlinks.append(status.entities['urls'][0]['url'])
                else:
                    hyperlinks.append('#')

for i in range(len(tweet)):
    if hyperlinks[i] == '0' and 'https://' in  tweet[i]:
        somet = tweet[i].find("https://")
        hyperlinks[i] = tweet[i][somet:somet+23]
        tweet[i] = tweet[i].replace(hyperlinks[i],' ')
        

for i in range(len(tweet)):
    if hyperlinks[i] != '#':
        somet = tweet[i].find("https://")
        hyperlinks[i] = tweet[i][somet:somet+23]
        tweet[i] = tweet[i].replace(hyperlinks[i],' ')
        
df = pd.DataFrame({"screenName":screennames_twitter,"Tweets":tweet,"Timeframe":tweets_dates,"Links":hyperlinks,"profilePictue":profile_pic})
df.sort_values(by=['Timeframe'], inplace=True, ascending=False)
df = df[df["Links"] != '#']
df = df.reset_index(drop=True)
df.to_csv('All-Tweets.csv',index=False)   
df