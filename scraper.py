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
	
	#code uncomment below and change localUrl to url to connect to live website
	# try:
		# response = requests.get(localUrl, timeout = 5)
		# content = BeautifulSoup(response.content, "html.parser")
	# except:
		# print("Connection failed - check URL")
	
	carArray = []	
	cars = content.findAll('div', attrs={"class": "su-post"})
	
	#PROBABLY NOT NEEDED
	headers = content.findAll('h2',attrs={"class": "su-post-title"})
	for h2 in headers:
		links = h2.find_all('a')
		type(links)
		#for link in links:
		#	print(link)
		#	print(' , ')

	
	for car in cars:
		dateAdded = car.find('div', attrs={"class": "su-post-meta"}).text
		titles = car.find('h2', attrs={"class": "su-post-title"})
		titleText= titles.find('a').contents[0]
		urls = titles.find('a',href=True)
		print(urls['href'])
		
		for url in urls:
			if 'bnr32' in url:
				urlList.append(url)
		#print(urlList)
		
		#print
		#if "bnr32" or "BNR32" in titleText:
		#	subUrl = titles.find('a')
		#	print(subUrl)
			#urlList.append()
		
		carObject = {
		"model": titleText,
		#"year": 
		"dateAdded": dateAdded.strip('\n\t').replace('Posted: ','')}
		carArray.append(carObject)
	#print(carArray)
	
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