#python 3.8.4
#need to run in virtual environment
#cd to \test-env\Scripts and run activate.bat, then can run scraper.py
#scrape tool using BeuatifulSoup and AWS lambda

from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime
import re

def getManufatureDate(subUrl):
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
		fullDate = row.findAll('h4')[1].text
		date = fullDate[0:4]
	return date

def getData():
	urlList = []
	url = 'https://trustplanning.world/used-car-inventory-list/'
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
	print('type')
	print(type(cars))
	
	
	for car in cars:
		#not working properly
		#can use regex here for better accuracy
		if 'bnr32' or 'BNR32' in car.text(): 
			#print('found')
			dateAdded = car.find('div', attrs={"class": "su-post-meta"}).text
			titles = car.find('h2', attrs={"class": "su-post-title"})
			titleText= titles.find('a').contents[0]
			#urls = titles.find('a',href=True).get('href')
			urls = titles.find('a').attrs['href'].split()
			for url in urls:
				urlList.append(url)
			year = getManufatureDate(url)
			carObject = {
			"model": titleText,
			"url": urls,
			"year": year, 
			"dateAdded": dateAdded.strip('\n\t').replace('Posted: ','')}
			carArray.append(carObject)

			#need to add this inside for car loop
			validUrls = [u for u in urlList if "bnr32" in u]
			#print('Number of good URLS ',len(validUrls))
			#print('total urls ',len(urlList))
	
		
	#can delete this after debug
	with open('urlList.txt', 'w') as f:
		for item in urlList:
			f.write(item)
			f.write(', ')
	
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