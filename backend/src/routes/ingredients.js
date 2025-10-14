const express = require('express');
const recipes = require('../data/recipes.json');
const router = express.Router();

// GET /api/ingredients - Get all available ingredients
router.get('/', (req, res) => {
  try {
    const allIngredients = [];
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if (!allIngredients.find(ing => ing.name === ingredient.name)) {
          allIngredients.push({
            name: ingredient.name,
            category: ingredient.category || 'other'
          });
        }
      });
    });
    
    // Sort alphabetically
    allIngredients.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({
      success: true,
      count: allIngredients.length,
      data: allIngredients
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ingredients',
      message: error.message
    });
  }
});

// GET /api/ingredients/categories - Get ingredient categories
router.get('/categories', (req, res) => {
  try {
    const categories = {};
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const category = ingredient.category || 'other';
        if (!categories[category]) {
          categories[category] = [];
        }
        if (!categories[category].includes(ingredient.name)) {
          categories[category].push(ingredient.name);
        }
      });
    });
    
    // Sort each category
    Object.keys(categories).forEach(category => {
      categories[category].sort();
    });
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ingredient categories',
      message: error.message
    });
  }
});

// POST /api/ingredients/suggest-substitutes - Suggest ingredient substitutes
router.post('/suggest-substitutes', (req, res) => {
  try {
    const { ingredient } = req.body;
    
    if (!ingredient) {
      return res.status(400).json({
        success: false,
        error: 'Ingredient name is required'
      });
    }
    
    // Simple substitution logic (can be enhanced)
    const substitutes = {
      'milk': ['almond milk', 'soy milk', 'oat milk', 'coconut milk'],
      'egg': ['flax egg (1 tbsp ground flax + 3 tbsp water)', 'applesauce', 'banana', 'yogurt'],
      'butter': ['coconut oil', 'olive oil', 'avocado', 'margarine'],
      'sugar': ['honey', 'maple syrup', 'stevia', 'coconut sugar'],
      'flour': ['almond flour', 'coconut flour', 'oat flour', 'whole wheat flour'],
      'chicken': ['tofu', 'tempeh', 'mushrooms', 'chickpeas'],
      'beef': ['lentils', 'mushrooms', 'beans', 'tofu']
    };
    
    const ingredientLower = ingredient.toLowerCase();
    let suggestions = [];
    
    // Find matching substitutes
    Object.keys(substitutes).forEach(key => {
      if (ingredientLower.includes(key) || key.includes(ingredientLower)) {
        suggestions = substitutes[key];
      }
    });
    
    // Default suggestions if no specific match found
    if (suggestions.length === 0) {
      suggestions = [
        'Try similar textured ingredients',
        'Consider plant-based alternatives',
        'Check for allergy-friendly options'
      ];
    }
    
    res.json({
      success: true,
      ingredient,
      substitutes: suggestions
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to suggest substitutes',
      message: error.message
    });
  }
});

module.exports = router;