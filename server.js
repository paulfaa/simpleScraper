const express = require('express')
const app = express()
const port = 3000
var path = require('path');
var serveStatic = require('serve-static')

app.use(serveStatic('public/', { 'index': ['resultsPage.html', 'resultsPage.js', 'resultsPage.css'] }))
app.listen(3000)
console.log(`Example app listening at http://localhost:3000`)

/* app.get('/', (req, res) => {
  //res.send('Hello World!')
  app.use(express.static('public'))
  //sendfile onlt works for one file, need to serve directoy
  res.sendFile(path.join(__dirname + '/resultsPage.html'));
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) */