const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const { redirectToOriginalUrl } = require('./controller/urlController');

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.1.204:5173',
  'https://url-shorten-website.vercel.app',   // <--- Your Vercel domain (update if custom!)
  'https://your-custom-domain.com'            // <--- Add your own domain if you use one
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server, Postman, curl, etc. (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
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
