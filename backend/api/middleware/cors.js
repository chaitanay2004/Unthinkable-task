const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
     'http://localhost:5001',  
    'http://127.0.0.1:5001',  
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

module.exports = cors(corsOptions);