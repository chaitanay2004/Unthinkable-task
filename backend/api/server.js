const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const recipeRoutes = require('./routes/recipes');
const ingredientRoutes = require('./routes/ingredients');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Root route - Welcome page
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Smart Recipe Generator API!',
    endpoints: {
      health: '/api/health',
      recipes: '/api/recipes',
      ingredients: '/api/ingredients'
    },
    status: 'Server is running 🚀'
  });
});

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Smart Recipe Generator API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
// });

module.exports = app;