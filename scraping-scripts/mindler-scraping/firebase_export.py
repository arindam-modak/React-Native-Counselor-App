#from firebase import firebase  
import csv
import pickle
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


cred = credentials.Certificate("service.json")

firebase_admin.initialize_app(cred, {
    'projectId': "counselling-bot-10fda",
})

db = firestore.client()

config = {
    "apiKey": "AIzaSyA1QuFJ-oeqLp0Q0akmBPVy9YUY84cxsoc",
    "authDomain": "counselling-bot-10fda.firebaseapp.com",
    "databaseURL": "https://counselling-bot-10fda.firebaseio.com",
   "projectId": "counselling-bot-10fda",
    "storageBucket": "counselling-bot-10fda.appspot.com",
    "messagingSenderId": "984760016813"

}


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
        #print('\n','summary','\n',self.summary)
        self.professions = getproffesional(url)
        #print('\n','Proffesions','\n',self.professions)
        self.career_path = getcareerpath(url)
        #print('\n','career-path','\n',self.career_path)
        self.important_facts = get_important_facts(url)
        #print('\n','important-facts','\n',self.important_facts)
        self.leading_colleges = getleadinginstitute(url)
        #print('\n','leading_colleges','\n',self.leading_colleges)
        self.institutions_abroad = getinstitutionsabroad(url)
        #print('\n','institutions abroad','\n',self.institutions_abroad)
        self.entrance_exams = get_entrance_exams(url)
        #print('\n','entrance_exams')
        #print(self.entrance_exams)
        self.work_description = get_work_description(url)
        #print('\n','work description','\n',self.work_description)
        self.pros,self.cons = get_pros_cons(url)
        #print("pros")
        #print(self.pros)
        #print("cons")
        #print(self.cons)
        #print('\n\n')
        
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

objects = []
with (open("CareerLibrary", "rb")) as openfile:
	while True:
		try:
			objects.append(pickle.load(openfile))
		except:
			break


filehandler = open("Field_list.txt",'r')
inp = filehandler.readlines()

  
for i in inp:
	data = {
			'name' : i
	}
	#db.child("Fieldlist").push(data, user['idToken'])
# db.collection(u'Counselling-BOT').document(u'Field').set(data)

db.collection(u'Fieldlist').push(data)

