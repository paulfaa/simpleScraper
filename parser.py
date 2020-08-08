import json
from datetime import datetime


t = datetime.now()
todayString = t.strftime("%Y-%m-%d")
carAdded = False

with open ('carList.json') as j:
	jData = json.load(j)
	
	for x in jData:
		if "bnr32" in x['model'].lower():
			print(x)
		if x['dateAdded'] == todayString:
			carAdded = True

if carAdded:
	print("New bnr32 added today")
	#call aws ses
else:
	print("No new bnr32 added today")
	
	
