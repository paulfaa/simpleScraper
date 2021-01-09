#python 3.8.4
#need to run in virtual environment
#cd to \test-env\Scripts and run activate.bat, then can run scraper.py
#scrape tool using BeuatifulSoup and AWS lambda

from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime
import time
import random
import re

urlList = []

url = 'https://trustplanning.world/used-car-inventory-list/'
LOCAL_URL_PATH = "C:\\Users\\Paul\\kikaku.html"
LOCAL_SUBURL_PATH = "C:\\Users\\Paul\\kikakuSubpage.html"
WORKING_DIRECTORY = "C:\\Users\\paulf\\Documents\\Code\\simpleScraper
MAX_PRICE = 2000000
MAX_YEAR = 1991

filterResults = False
useHostedSite = True


def getSubpageData(subUrl):
	#for scraping date from subpage
	useHostedSite = False
	time.sleep(random.randint(1, 4))
	
	if useHostedSite == True:
		try:	
			#add headers here too
			headers = requests.utils.default_headers()
			headers.update({'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'})
			response = requests.get(subUrl, headers=headers)
			subContent = BeautifulSoup(response.content, "html.parser")
		except:
			print("Connection failed - check connection")
	else:
		subContent = BeautifulSoup(open("C:\\Users\\Paul\\kikakuSubpage.html",encoding="utf8"), "html.parser")
	
	#response = requests.get(subUrl)
	#subContent = BeautifulSoup(response.content, "html.parser")
	
	table = subContent.findAll('table', style={"width: 1395px; border-collapse: collapse;"})
	for row in table:
		price = re.sub('\D', '', row.findAll('h4')[6].text)
		fullDate = row.findAll('h4')[1].text
		date = fullDate[0:4]
		return [price, date]
		#otherwise append each value to a list and return both lists
		
def CheckIfMatchesFilters(car):
	if car.year <= MAX_YEAR and car.price <= MAX_PRICE:
		return True
	else:
		print("No suitable cars found")
	
	#can split this into 2 different functions
def getData():
	useHostedSite == False
	LOCAL_URL_PATH = "C:\\Users\\Paul\\kikaku.html"
	
	#set headers to stop request being identified as a bot
	headers = requests.utils.default_headers()
	headers.update({'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'})

	if useHostedSite == True:
		try:
			response = requests.get('https://trustplanning.world/used-car-inventory-list/', headers=headers)
			content = BeautifulSoup(response.content, "html.parser")
		except:
			print("Connection failed - check URL")
	else:
		print('using local site')
		print('LOCALURL', LOCAL_URL_PATH)
		content = BeautifulSoup(open(LOCAL_URL_PATH,encoding="utf8"), "html.parser")

	carArray = []	
	cars = content.findAll('div', attrs={"class": "su-post"})
	
	for car in cars:
		titles = car.find('h2', attrs={"class": "su-post-title"})
		#need to filter this futher, unicode chars like \u30105181 \u3011 are being saved to JSON
		titleText= titles.find('a').contents[0]

		if "bnr32" in titleText.lower():
			dateAdded = car.find('div', attrs={"class": "su-post-meta"}).text
			
			#rewrite this part, cleaner to get just this url instead of all every time
			urls = titles.find('a').attrs['href'].split()
			for url in urls:
				urlList.append(url)
			print("Subpage url is: ",url)
			if checkUrlIsNew(url) == False:
				break
				#continue may be better option than break
			else:
				subPageData = getSubpageData(url)
				print(subPageData[1])
				print(subPageData[0])
				price = subPageData[0]
				year = subPageData[1]
				carObject = {
					"model": titleText,
					#url is getting saved as an array - should be single string
					"url": urls,
					"year": year,
					"price": price,
					"dateAdded": dateAdded.strip('\n\t').replace('Posted: ','')}
				
				if filterResults:
					if filterCar(carObject) == False:
						#break
						pass
				else:
					carArray.append(carObject)

	#store a list of all scraped urls
	with open('urlList.txt', 'w') as f:
		for item in urlList:
			f.write(item)
			f.write('\n')
					
	with open(WORKING_DIRECTORY + "\\carList.json") as f:
		data = json.load(f)
		savedFileSize = len(data)
	currentFileSize = len(carArray)

	if currentFileSize > savedFileSize:
		try:
			#need to append only new values to json instead of rewriting each time
			#check if json to be written already exists
			with open('carList.json', 'w') as outfile:
				json.dump(carArray, outfile)
		except:
			print("Write to file failed")

def checkUrlIsNew(url):
	print('Checking url ',url)
	try:
		with open (WORKING_DIRECTORY + "\\urlList.txt", "r") as u:
			content = u.read()
	except:
		print("Read urlList failed, check file exists")

	if url in content:
		print('Url already scraped')
		return False
	else:
		print('New url, ok to scrape')
		return True
	u.close()
		
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
				
# def main():
	# getData()
	# parseData()
	
# if __name__ == "__main__":
    # main()
	
getData()
#parseData()
