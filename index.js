require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
// app.get('/api/shorturl', function(req, res) {
//   res.json({ greeting: 'hello API' });
// });
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const urls = {1: "https://forum.freecodecamp.org"};

app.post('/api/shorturl', async (req, res) => {
  let urlID = 1;
  const url = req.body.url; // Access the URL from the request body
  let existenceChecker = Object.keys(urls).includes(urlID.toString);
  if(existenceChecker)
    {
      while (existenceChecker) {
    urlID = urlID+1;
    existenceChecker = Object.keys(urls).includes(urlID.toString());
  }}
  urls[urlID] = url;
  // console.log("URLS: ", urls);
  res.json({ "original_url": url, "short_url":  urlID}); // Respond with the received URL
});

app.get('/api/shorturl/:short',
  (req, res) => {
    const shortUrlRequested = req.params.short;
    const {longUrl, shortUrl} = req.body; 
    // console.log("Long URL: ", longUrl);
    res.redirect(longUrl);
    console.log('longUrl :>> ', longUrl);
    // console.log(req.body);
  }

)

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
