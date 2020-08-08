from bs4 import BeautifulSoup
import requests
import json

url = 'https://trustplanning.world/used-car-inventory-list/'
response = requests.get(url, timeout = 5)
content = BeautifulSoup(response.content, "html.parser")

# cars = content.findAll('div', attrs={"class": "su-post"})
# for car in cars:
	# print(car)
	
# carArray = []	
# for car in content.findAll('div', attrs={"class": "su-post"})
	# carObect = {
		# "model": car.find('a', attrs={"class": "su-post-title").text.encode('utf-8'),
		# "dateAdded": car.find('div', attrs={"class": "su-post-meta").text.encode('utf-8')
	# }
# print(carObect)

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

with open('carList.json', 'w') as outfile:
	json.dump(carArray, outfile)