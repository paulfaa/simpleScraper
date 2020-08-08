#python 3.8.4
#need to run in virtual environment
#scrape tool using AWS lamda and SNS

from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime

def getData():
	url = 'https://trustplanning.world/used-car-inventory-list/'
	try:
		response = requests.get(url, timeout = 5)
		content = BeautifulSoup(response.content, "html.parser")
	except:
		print("Connection failed - check URL")
	carArray = []	
	cars = content.findAll('div', attrs={"class": "su-post"})
	for car in cars:

		#carObject = {
		#		"model": car.find('a', attrs={"class": "su-post-title"}),
		#		"dateAdded": car.find('div', attrs={"class": "su-post-meta"})
		#	}
		dateAdded = car.find('div', attrs={"class": "su-post-meta"}).text
		titles = car.find('h2', attrs={"class": "su-post-title"})
		titleText= titles.find('a').contents[0]
		carObject = {
		"model": titleText,
		"dateAdded": dateAdded.strip('\n\t').replace('Posted: ','')}
		carArray.append(carObject)
	print(carArray)
	try:
		with open('carList.json', 'w') as outfile:
			json.dump(carArray, outfile)
	except:
		print("Write to file failed")
		
def parseData():
	t = datetime.now()
	todayString = t.strftime("%Y-%m-%d")
	carAdded = False
	try:
		with open ('carList.json') as j:
			jData = json.load(j)
			
			for x in jData:
				if "bnr32" in x['model'].lower():
					print(x)
				if x['dateAdded'] == todayString:
					carAdded = True
	except:
		print("Open file failed")

	if carAdded:
		print("New bnr32 added today")
		#call aws ses
	else:
		print("No new bnr32 added today")
				
getData()
parseData()