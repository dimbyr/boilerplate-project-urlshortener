require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Configuration
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

// Schema and Model
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url:  { type: String, unique: true }
});
const Url = mongoose.model('Url', urlSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;
  const urlRegex = /^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+$/ ;
  if (!urlRegex.test(url)){
    res.json({ error: 'invalid url'});
    return;
  }
  try {
    const count = await Url.countDocuments();
    const newUrl = new Url({ original_url: url, short_url: count + 1 });
    await newUrl.save();

    res.json(
      newUrl
      // {original_url: `${url}`, short_url: newUrl.short_url}
    );
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/shorturl/:short', async (req, res) => {
  try {
    const shortUrl = req.params.short;
    const urlEntry = await Url.findOne({ short_url: shortUrl });

    if (urlEntry) {
      return res.redirect(urlEntry.original_url);
    }

    res.status(404).json({ error: 'URL not found' });
  } catch (error) {
    console.error('Error retrieving URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
