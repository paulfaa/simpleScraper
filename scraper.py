#python 3.8.4
#need to run in virtual environment
#cd to \test-env\Scripts and run activate.bat, then can run scraper.py
#scrape tool using BeuatifulSoup and AWS lambda

from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime
import re

urlList = []
url = 'https://trustplanning.world/used-car-inventory-list/'
filterResults = False
MAX_PRICE = 2000000
MAX_YEAR = 1991

def getSubpageData(subUrl):
	#for scraping date from subpage
	subContent = BeautifulSoup(open("C:\\Users\\Paul\\kikakuSubpage.html",encoding="utf8"), "html.parser")
	#uncomment below to connect to live site
	#should add wait command so script doesnt look like ddos
	# try:
		# response = requests.get(subUrl, timeout = 5)
		# subContent = BeautifulSoup(response.content, "html.parser")
	# except:
		# print("Connection failed - check URL")
	table = subContent.findAll('table', style={"width: 1395px; border-collapse: collapse;"})
	for row in table:
		price = re.sub('\D', '', row.findAll('h4')[6].text)
		fullDate = row.findAll('h4')[1].text
		date = fullDate[0:4]
	print(price)
	return [price, date]

def getData():
	localUrl = "C:\\Users\\Paul\\kikaku.html"
	content = BeautifulSoup(open("C:\\Users\\Paul\\kikaku.html",encoding="utf8"), "html.parser")
	
	#code uncomment below to connect to live website
	# try:
		# response = requests.get(url, timeout = 5)
		# content = BeautifulSoup(response.content, "html.parser")
	# except:
		# print("Connection failed - check URL")
		
	carArray = []	
	cars = content.findAll('div', attrs={"class": "su-post"})
	
	for car in cars:
		titles = car.find('h2', attrs={"class": "su-post-title"})
		titleText= titles.find('a').contents[0]

		if "bnr32" in titleText.lower():
			dateAdded = car.find('div', attrs={"class": "su-post-meta"}).text
			
			#rewrite this part, cleaner to get just this url instead of all every time
			urls = titles.find('a').attrs['href'].split()
			for url in urls:
				urlList.append(url)
			#need to test this on live site
			year = getSubpageData(url)[1]
			price = getSubpageData(url)[0]
			carObject = {
				"model": titleText,
				"url": urls,
				"year": year,
				"price": price,
				"dateAdded": dateAdded.strip('\n\t').replace('Posted: ','')}
			
			if filterResults:
				if year <= MAX_YEAR and price <= MAX_PRICE:
					carArray.append(carObject)
			else:
				carArray.append(carObject)


		
	#can delete this after debug
	with open('urlList.txt', 'w') as f:
		for item in urlList:
			f.write(item)
			f.write('\n')
	
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
				
# def main():
	# getData()
	# parseData()
	
# if __name__ == "__main__":
    # main()
	
getData()
#parseData()