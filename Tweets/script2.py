# Google news
import requests
from bs4 import BeautifulSoup
import pandas as pd

link = 'https://news.google.com/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNREZqY0hsNUVnSmxiaWdBUAE?hl=en-IN&gl=IN&ceid=IN%3Aen'      

source = requests.get(link).text
soup = BeautifulSoup(source,'lxml')

topNews, localNews, economicImpact, scienceResearch, travelImpact,linksForMoreNews = [], [], [], [], [], []


mainDivs = soup.find_all('div',{'class':'DBQmFf NclIid BL5WZb Oc0wGc xP6mwf j7vNaf'})
for i in mainDivs:
    try:
        h = i.find('div',{'class':'cp7Yvc'})
        try:
            more = h.find('a')
            linksForMoreNews.append('https://news.google.com/'+more['href'][2:])
        except:
            pass
        div = i.find_all('div',{'class':'xrnccd tcvRoe R7GTQ keNKEd j7vNaf'})
        a = i.find_all('a',{'class':'VDXfz'})
        for j in div:
            headlines = j.find_all('h3')
            refs = j.find_all('a',{'class':'wEwyrc AVN2gc uQIVzc Sksgp'})
            time = j.find_all('time')           
            for k,l,m,n in zip(headlines,refs,time,a):
                news = k.text+'\nReference: '+l.text+'\nUpdated: '+m.text+'\n','https://news.google.com/'+n['href'][2:]
                if(h.text == 'Top news'):
                    topNews.append(news)
                if(h.text == 'Local newsSuggested locations'):
                    localNews.append(news)
                if(h.text == 'Economic impact'):
                    economicImpact.append(news)
                if(h.text == 'Science & research'):
                    scienceResearch.append(news)
                if(h.text == 'Travel impact'):
                    travelImpact.append(news)
                news = ''
                
        
    except:
        print()

def DfNews(news, name,linksForMoreNews):
    links = []
    for i in range(len(news)):
        links.append(news[i][1])
        news[i] = news[i][0]

    df = pd.DataFrame({"News":news,"Links":links,'Main Link':linksForMoreNews})
    df.to_csv(name+'.csv')


DfNews(topNews, 'Top News','NA')
DfNews(localNews, 'Local newsSuggested locations',linksForMoreNews[0])
DfNews(economicImpact, 'Economic Impact',linksForMoreNews[1])
DfNews(scienceResearch, 'Science and Research',linksForMoreNews[2])
DfNews(travelImpact, 'Travel Impact',linksForMoreNews[3])