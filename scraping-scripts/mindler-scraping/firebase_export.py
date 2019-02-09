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


'''filehandler = open("Field_list.txt",'r')
inp = filehandler.readlines()
filehandler.close()

  
for i in inp:
    filehandler2 = open(str(i).lstrip().rstrip(),'r')
    inp2 = filehandler2.readlines()
    filehandler2.close()
    data = {'name' : str(i).lstrip().rstrip() , 'careers' : inp2}
    db.collection(u'Fieldlist').document().set(data)'''


'''for i in objects:
    for j in i.career:
        data = {
        'superCareer': i.name ,
        'name' : str(j.name).lstrip().rstrip() ,
        'summary' : str(j.summary), 
        'professions' : [ { pro[0]: pro[1] }  for pro in j.professions ],
        'career_path' : [ { 'stream': j.career_path[pro][0], 'graduation': j.career_path[pro][1], 'after-graduation': j.career_path[pro][2], 'after-post-graduation': j.career_path[pro][3] }  for pro in range(1,len(j.career_path)) ],
        'important_facts' : [ fac for fac in j.important_facts],
        'leading_colleges' : [ { 'college': j.leading_colleges[pro][0], 'location': j.leading_colleges[pro][1], 'website': j.leading_colleges[pro][2] }  for pro in range(1,len(j.leading_colleges)) ],
        'institutions_abroad' : [ { 'college': j.institutions_abroad[pro][0], 'location': j.institutions_abroad[pro][1], 'website': j.institutions_abroad[pro][2] }  for pro in range(1,len(j.institutions_abroad)) ],
        'entrance_exams' : [ { 'college': j.entrance_exams[pro][0], 'tentative-date': j.entrance_exams[pro][1], 'important-elements': j.entrance_exams[pro][2], 'website': j.entrance_exams[pro][3] }  for pro in range(1,len(j.entrance_exams)) ],
        'work_description' : [ fac for fac in j.work_description],
        'pros' : [ fac for fac in j.pros],
        'cons' : [ fac for fac in j.cons]
        }
        db.collection(u'AllCareers').document().set(data)'''
