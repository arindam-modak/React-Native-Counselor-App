from bs4 import BeautifulSoup
import urllib.request
import csv
import pickle

keywords=["summary","professional","career-path","important-facts","leading-colleges","institutions-abroad","entrance-exams","work-description","pros-cons"]

def getsummary(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    
    #for i in keywords:
    #    print(soup.find_all(id=i,class_="cd-row"))

    # for summery
    k=soup.find_all(id="summary",class_="cd-row")
    if k is None:
        return ""
    for i in k:
        summary=i.find("p").getText()
    return summary
        
def getproffesional(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    k = soup.find('div',class_='accordian-set')
    if k is None:
        return []
    titles = k.find_all('a')
    description = k.find_all('div',class_='details')
    proffesions = []
    for i in range(len(titles)):
        row = []
        row.append(titles[i].text)
        row.append(description[i].text)
        proffesions.append(row)
    return proffesions

def getcareerpath(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    k = soup.find('div',id = "career-path",class_='cd-row')
    if k is None:
        return []
    #print(k)
    careers = []
    headings = ['stream','graduation','after-graduation','after-post-graduation']
    careers.append(headings)
    temp = k.find('div',class_="table-mobile")
    list = temp.find_all('td')
    count = 0
    row = []
    for i in range(len(list)):
        row.append(list[i].text)
        count = count + 1
        if count%4 == 0:
            careers.append(row)
            row = []
    return careers

def getleadinginstitute(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    k = soup.find('div',id = "leading-colleges",class_='cd-row')
    if k is None:
        return []
    #print(k)
    colleges = []
    headings = ['college','location','website']
    colleges.append(headings)
    temp = k.find('div',class_="table-mobile")
    list = temp.find_all('td')
    count = 0
    row = []
    for i in range(len(list)):
        if count%3 == 2:
            t = list[i].text.split(' ')
            row.append(t[0])    
        else:   
            row.append(list[i].text)
        count = count + 1
        if count%3 == 0:
            colleges.append(row)
            row = []
    return colleges

def getinstitutionsabroad(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    k = soup.find('div',id = "institutions-abroad",class_='cd-row')
    #print(k)
    if k is None:
        return []
    colleges = []
    headings = ['college','location','website']
    colleges.append(headings)
    temp = k.find('div',class_="table-mobile")
    if temp is None:
        return []
    list = temp.find_all('td')
    count = 0
    row = []
    for i in range(len(list)):
        if count%3 == 2:
            t = list[i].text.split(' ')
            row.append(t[0])    
        else:   
            row.append(list[i].text)
        count = count + 1
        if count%3 == 0:
            colleges.append(row)
            row = []
    return colleges

def get_entrance_exams(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    k = soup.find('div',id = "entrance-exams",class_='cd-row')
    #print(k)
    if k is None:
        return []
    exams = []
    row = []
    #print("test")
    temp = k.find('div',class_="table-mobile")
    #print(temp)
    list = temp.find_all('th')
    for i in list:
        row.append(i.text)
    exams.append(row)
    
    list = temp.find_all('td')
    count = 0
    row = []
    for i in range(len(list)):
        if count%4 == 3:
            t = list[i].text.split(' ')
            row.append(t[0])    
        else:   
            row.append(list[i].text)
        count = count + 1
        if count%4 == 0:
            exams.append(row)
            row = []
    return exams

def get_work_description(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    k = soup.find('div',id='work-description',class_='cd-row')
    if k is None:
        return []
    description = k.find_all('li')
    workdes = []
    for i in description:
        workdes.append(i.text)
    return workdes

def get_pros_cons(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    k = soup.find('div',class_='pros-ul')
    pros = []
    if k != None:
        p = k.find_all('li')
        for i in p:
            pros.append(i.text)
    cons = []
    k = soup.find('div',class_='cons-ul')
    if k != None:    
        c = k.find_all('li')
        for i in c:
            cons.append(i.text)

    return pros,cons

def get_important_facts(url):
    global keywords
    url2=url
    page = urllib.request.urlopen(url2)
    soup = BeautifulSoup(page, 'html.parser')
    k = soup.find('div',id='important-facts',class_='cd-row')
    if k is None:
        return []
    description = k.find_all('li')
    facts = []
    for i in description:
        facts.append(i.text)
    return facts
    
class Career:
    def __init__(self,url):
        url2=url
        page = urllib.request.urlopen(url2)
        soup = BeautifulSoup(page, 'html.parser')
        div = soup.find(class_="career-details-section")
        name = div.find('h2')
        self.name = name.text
        print(self.name)
        self.summary = getsummary(url)
        print('\n','summary','\n',self.summary)
        self.professions = getproffesional(url)
        print('\n','Proffesions','\n',self.professions)
        self.career_path = getcareerpath(url)
        print('\n','career-path','\n',self.career_path)
        self.important_facts = get_important_facts(url)
        print('\n','important-facts','\n',self.important_facts)
        self.leading_colleges = getleadinginstitute(url)
        print('\n','leading_colleges','\n',self.leading_colleges)
        self.institutions_abroad = getinstitutionsabroad(url)
        print('\n','institutions abroad','\n',self.institutions_abroad)
        self.entrance_exams = get_entrance_exams(url)
        print('\n','entrance_exams')
        print(self.entrance_exams)
        self.work_description = get_work_description(url)
        print('\n','work description','\n',self.work_description)
        self.pros,self.cons = get_pros_cons(url)
        print("pros")
        print(self.pros)
        print("cons")
        print(self.cons)
        print('\n\n')
        
class Field:
    def __init__(self,url):
        url2=url
        page = urllib.request.urlopen(url2)
        soup = BeautifulSoup(page, 'html.parser')
        div = soup.find(id='career-bucket-page',class_="career-library-new career-details-page career-last-page")
        name = div.find('h4')
        self.name = name.text
        career = []
        div = soup.find('div',id="library-data-bucket",class_="cl-row search-topics last-page")
        temp = div.find_all('a')
        urls = []
        for i in temp:
            career.append(Career(i.get('href')))
        #self.careers = career    

urls=["https://www.mindler.com/careerlibrary/Actuarial-Sciences","https://www.mindler.com/careerlibrary/Allied-Medicine","https://www.mindler.com/careerlibrary/Animation-Graphics","https://www.mindler.com/careerlibrary/Applied-Arts","https://www.mindler.com/careerlibrary/Architecture","https://www.mindler.com/careerlibrary/Aviation","https://www.mindler.com/careerlibrary/Cabin-Crew","https://www.mindler.com/careerlibrary/Civil-Services","https://www.mindler.com/careerlibrary/Commerce-Accounts","https://www.mindler.com/careerlibrary/Computer-Application-IT","https://www.mindler.com/careerlibrary/Distribution-Logistics","https://www.mindler.com/careerlibrary/Defense","https://www.mindler.com/careerlibrary/Design","https://www.mindler.com/careerlibrary/Economics","https://www.mindler.com/careerlibrary/Education-Training","https://www.mindler.com/careerlibrary/Engineering","https://www.mindler.com/careerlibrary/Entrepreneurship","https://www.mindler.com/careerlibrary/Ethical-Hacking","https://www.mindler.com/careerlibrary/Finance-Banking","https://www.mindler.com/careerlibrary/Food-Agriculture","https://www.mindler.com/careerlibrary/Hotel-Management","https://www.mindler.com/careerlibrary/Law","https://www.mindler.com/careerlibrary/Life-Science-Environment","https://www.mindler.com/careerlibrary/Management","https://www.mindler.com/careerlibrary/Marketing-Advertising","https://www.mindler.com/careerlibrary/Maths-Statistics","https://www.mindler.com/careerlibrary/Media-Communication","https://www.mindler.com/careerlibrary/Medicine","https://www.mindler.com/careerlibrary/Merchant-Navy","https://www.mindler.com/careerlibrary/Nutrition-Fitness","https://www.mindler.com/careerlibrary/Performing-Arts","https://www.mindler.com/careerlibrary/Physical-Science","https://www.mindler.com/careerlibrary/Sales","https://www.mindler.com/careerlibrary/Social-Sciences-Humanities","https://www.mindler.com/careerlibrary/Social-Services"]

CareerLibrary = []
filehandler = open('CareerLibrary','wb')
for url in urls:
    field = Field(url)
    pickle.dump(field,filehandler)    


# page = urllib.request.urlopen('https://www.mindler.com/careerlibrary/')
#     soup = BeautifulSoup(page, 'html.parser')




