#from firebase import firebase  
import csv
import pickle
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
import json
import time
import random

cred = credentials.Certificate("service.json")

firebase_admin.initialize_app(cred, {
    'projectId': "",

})

db = firestore.client()

config = {
    

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


# for i in objects:
#     for j in i.career:
#         data = {
#         'superCareer': i.name ,
#         'name' : str(j.name).lstrip().rstrip() ,
#         'summary' : str(j.summary), 
#         'professions' : [ { pro[0]: pro[1] }  for pro in j.professions ],
#         'career_path' : [ { 'stream': j.career_path[pro][0], 'graduation': j.career_path[pro][1], 'after-graduation': j.career_path[pro][2], 'after-post-graduation': j.career_path[pro][3] }  for pro in range(1,len(j.career_path)) ],
#         'important_facts' : [ fac for fac in j.important_facts],
#         'leading_colleges' : [ { 'college': j.leading_colleges[pro][0], 'location': j.leading_colleges[pro][1], 'website': j.leading_colleges[pro][2] }  for pro in range(1,len(j.leading_colleges)) ],
#         'institutions_abroad' : [ { 'college': j.institutions_abroad[pro][0], 'location': j.institutions_abroad[pro][1], 'website': j.institutions_abroad[pro][2] }  for pro in range(1,len(j.institutions_abroad)) ],
#         'entrance_exams' : [ { 'college': j.entrance_exams[pro][0], 'tentative-date': j.entrance_exams[pro][1], 'important-elements': j.entrance_exams[pro][2], 'website': j.entrance_exams[pro][3] }  for pro in range(1,len(j.entrance_exams)) ],
#         'work_description' : [ fac for fac in j.work_description],
#         'pros' : [ fac for fac in j.pros],
#         'cons' : [ fac for fac in j.cons],
#         'salary' : random.randint(800000,4000000)
#         }
#         db.collection(u'AllCareers').document().set(data)

# location_firebase_lat = {}
# location_firebase_lng = {}
# locations_total = {}
# for i in objects:
#     for j in i.career:
#         for k in j.leading_colleges:
#             locations_total[k[1]] = 1

# for key in locations_total:
#     time.sleep(0.2)
#     url = "http://www.mapquestapi.com/geocoding/v1/address?key=%20rZiYsbTVoDtG20gAtHZxaXarvFdpbCTH&location="+key
#     myResponse = requests.get(url)
#     # For successful API call, response code will be 200 (OK)
#     if(myResponse.ok):
#         jData = json.loads(myResponse.content)
#         if len(jData['results'][0]['locations']) >= 1:
#             location_firebase_lat[key] = jData['results'][0]['locations'][0]['latLng']['lat']
#             location_firebase_lng[key] = jData['results'][0]['locations'][0]['latLng']['lng']
#             print(jData['results'][0]['locations'][0]['latLng']['lat'],jData['results'][0]['locations'][0]['latLng']['lng'])

#     else:
#         # If response code is not ok (200), print the resulting http error code with description
#         myResponse.raise_for_status()

# cred = credentials.Certificate("service.json")

# firebase_admin.initialize_app(cred, {
#     'projectId': "counselling-bot-10fda",
# })

# db = firestore.client()

# for key in location_firebase_lat:
#     data = {
#         'Name': key,
#         'Latitude': location_firebase_lat[key],
#         'Longitude': location_firebase_lng[key]
#     }
#     db.collection(u'Locations').document().set(data)

# print(location_firebase_lat)
# print(location_firebase_lng)

# filehandler = open("Field_list.txt",'r')
# inp = filehandler.readlines()
# filehandler.close()

# for i in inp:
#     filehandler2 = open(str(i).lstrip().rstrip(),'r')
#     inp2 = filehandler2.readlines()
#     filehandler2.close()
#     print('"'+str(i).lstrip().rstrip()+'",'+'"'+str(i).lstrip().rstrip().upper()+'",'+'"'+str(i).lstrip().rstrip().lower()+'"')
    


# career_list = []
# for i in objects:
#     for j in i.career:
#         career_list.append(str(j.name).lstrip().rstrip())

# for i in range(0,200):
#     temp_list = []
#     for j in range(0,random.randint(5,30)):
#         kk = random.randint(0,len(career_list)-1)
#         if career_list[kk] not in temp_list:
#             temp_list.append(career_list[kk])

#     data = {
#         'Username' : "User"+str(random.randint(1000,10000000)),
#         'Password' : "Pass"+str(random.randint(1000,10000000)),
#         'Searches' : temp_list
#     }
#     db.collection(u'Users').document().set(data)
#     print(data)



# left = [('Audiologist', 'Chemical and Petroleum Engineering'), ('Audiologist', 'Home Science'), ('Chemical and Petroleum Engineering', 'Home Science'), ('Gender/Women Studies', 'Jewellery Design'), ('Gender/Women Studies', 'Marine Biology'), ('Jewellery Design', 'Marine Biology'), ('Instructional Design', 'UX Design'), ('Instructional Design', 'Video/Radio Jockey'), ('UX Design', 'Video/Radio Jockey'), ('Instructional Design', 'Mass Communication'), ('Mass Communication', 'Video/Radio Jockey'), ('Astronomy', 'Hotel Management'), ('Astronomy', 'Mass Communication'), ('Hotel Management', 'Mass Communication'), ('Agricultural Engineering', 'Homeopathy'), ('Agricultural Engineering', 'Microbiology'), ('Homeopathy', 'Microbiology'), ('Indian Army', 'Textile and Apparel Design'), ('Indian Army', 'Web Design'), ('Textile and Apparel Design', 'Web Design'), ('CS, IT and Software Engineering', 'Pilot'), ('CS, IT and Software Engineering', 'Veterinarian'), ('Pilot', 'Veterinarian'), ('Chemistry', 'Homeopathy'), ('Chemistry', 'Product Design'), ('Homeopathy', 'Product Design'), ('Astronomy', 'Biophysics'), ('Astronomy', 'Certified Public Accountant'), ('Biophysics', 'Certified Public Accountant'), ('Market Research', 'Pharmacy'), ('Market Research', 'Photography'), ('Pharmacy', 'Photography')]
# right = [('Home Science',), ('Chemical and Petroleum Engineering',), ('Audiologist',), ('Marine Biology',), ('Jewellery Design',), ('Gender/Women Studies',), ('Video/Radio Jockey',), ('Mass Communication',), ('Instructional Design',), ('Video/Radio Jockey',), ('Instructional Design',), ('Mass Communication',), ('Hotel Management',), ('Astronomy',), ('Microbiology',), ('Homeopathy',), ('Agricultural Engineering',), ('Web Design',), ('Textile and Apparel Design',), ('Indian Army',), ('Veterinarian',), ('Pilot',), ('CS, IT and Software Engineering',), ('Product Design',), ('Homeopathy',), ('Chemistry',), ('Certified Public Accountant',), ('Biophysics',), ('Astronomy',), ('Photography',), ('Pharmacy',), ('Market Research',)]
# for i in range(0,len(left)):
#     data = {
#         'left' : list(left[i]),
#         'right' : list(right[i])
#     }
#     db.collection(u'Recommendation').document().set(data)
#     print(data)
#     


# file = open('mindler','r')
# data2 = file.readlines()

# for i in range(0,len(data2)):
#     temp = data2[i].split(",")
#     data = db.collection(u'AllCareers').where('name','==', temp[0]).get()
#     for doc in data:
#         print(doc.id)
#         data3 = {
#             'Artistic' : float(temp[1]),
#             'Conventional' : float(temp[2]),
#             'Enterprising' : float(temp[3]),
#             'Investigative' : float(temp[4]),
#             'Realistic' : float(temp[5]),
#             'Social' : float(temp[6]) 
#         }
#         db.collection(u'AllCareers').document(doc.id).update(data3)