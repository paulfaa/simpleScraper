#python 3.8.4
#need to run in virtual environment
#scrape tool using BeuatifulSoup and AWS lambda

from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime
import re

def getData():
	urlList = []
	url = 'https://trustplanning.world/used-car-inventory-list/'
	localUrl = "C:\\Users\\Paul\\kikaku.html"
	content = BeautifulSoup(open("C:\\Users\\Paul\\kikaku.html",encoding="utf8"), "html.parser")
	subContent = BeautifulSoup(open("C:\\Users\\Paul\\kikakuSubpage.html",encoding="utf8"), "html.parser")
	
	#code uncomment below and change localUrl to url to connect to live website
	# try:
		# response = requests.get(localUrl, timeout = 5)
		# content = BeautifulSoup(response.content, "html.parser")
	# except:
		# print("Connection failed - check URL")
	
	carArray = []	
	cars = content.findAll('div', attrs={"class": "su-post"})
	
	#for scraping date from subpage
	table = subContent.findAll('table', style={"width: 1395px; border-collapse: collapse;"})
	#print(table)
	for row in table:
		x = table.find('tbody')
	print(x)
	#table_body = table.findAll('tbody')
	#row = table_body.find_all('tr')[1]
	#print(row)
	
	
	for car in cars:
		dateAdded = car.find('div', attrs={"class": "su-post-meta"}).text
		titles = car.find('h2', attrs={"class": "su-post-title"})
		titleText= titles.find('a').contents[0]
		#urls = titles.find('a',href=True).get('href')
		urls = titles.find('a').attrs['href'].split()
		for url in urls:
			urlList.append(url)
		
		carObject = {
		"model": titleText,
		"url": urls,
		#"year": 
		"dateAdded": dateAdded.strip('\n\t').replace('Posted: ','')}
		carArray.append(carObject)
	#print(carArray)
	
	
	validUrls = [u for u in urlList if "bnr32" in u]
	print('Number of good URLS ',len(validUrls))
	print('total urls ',len(urlList))
	
		
	#can delete this after debug
	with open('your_file.txt', 'w') as f:
		for item in urlList:
			f.write(item)
	
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