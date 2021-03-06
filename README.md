# simpleScraper
### Python and AWS based scraper which outputs data onto web frontend using Bootstrap + nodeJS

```
Workflow:
-Lamdba function scheduled to run once per day
-Python (BeautifulSoup 4) pulls desired data from website
-Data is formatted and exported as JSON
-JSON file is pushed to S3 bucket (boto3)
-Latest data is processed using JS and displayed to user
```
