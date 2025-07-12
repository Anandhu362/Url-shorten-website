// app.js

const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const { redirectToOriginalUrl } = require('./controller/urlController');

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.1.204:5173' // Your specific IP address
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/urls', urlRoutes);
app.get('/:shortId', redirectToOriginalUrl);
app.get('/', (req, res) => {
  res.send('API is working!');
});

module.exports = app;