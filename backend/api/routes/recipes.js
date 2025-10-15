const express = require('express');
const RecipeMatcher = require('../utils/recipeMatcher');
const router = express.Router();

// GET /api/recipes - Get all recipes with optional filtering
router.get('/', (req, res) => {
  try {
    const { search, dietary, maxTime, difficulty, limit } = req.query;
    
    console.log("📖 GET /api/recipes - Query parameters:", { search, dietary, maxTime, difficulty, limit });
    
    let recipes;
    
    if (search) {
      recipes = RecipeMatcher.searchRecipes(search, { dietary });
    } else {
      recipes = RecipeMatcher.findMatchingRecipes([], { 
        dietary, 
        maxTime: parseInt(maxTime) || 120,
        difficulty 
      });
    }
    
    if (limit && !isNaN(limit)) {
      recipes = recipes.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recipes',
      message: error.message
    });
  }
});

// POST /api/recipes/find - Find recipes by ingredients
router.post('/find', (req, res) => {
  try {
    const { ingredients, dietary, maxTime, difficulty } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        error: 'Ingredients array is required'
      });
    }
    
    const matchingRecipes = RecipeMatcher.findMatchingRecipes(ingredients, {
      dietary,
      maxTime: parseInt(maxTime) || 120,
      difficulty
    });
    
    res.json({
      success: true,
      count: matchingRecipes.length,
      ingredientsProvided: ingredients,
      filters: { dietary, maxTime, difficulty },
      data: matchingRecipes
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to find matching recipes',
      message: error.message
    });
  }
});

// GET /api/recipes/featured - Get featured recipes
router.get('/featured', (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const featuredRecipes = RecipeMatcher.getFeaturedRecipes(parseInt(limit));
    
    res.json({
      success: true,
      count: featuredRecipes.length,
      data: featuredRecipes
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured recipes',
      message: error.message
    });
  }
});

// GET /api/recipes/:id - Get recipe by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const recipe = RecipeMatcher.getRecipeById(id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }
    
    res.json({
      success: true,
      data: recipe
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recipe',
      message: error.message
    });
  }
});

// GET /api/recipes/debug/ingredients - Debug endpoint to see all available ingredients
router.get('/debug/ingredients', (req, res) => {
  try {
    const allRecipes = require('../data/recipes.json');
    const allIngredients = new Set();
    
    allRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        allIngredients.add(ing.name.toLowerCase());
      });
    });
    
    const sortedIngredients = Array.from(allIngredients).sort();
    
    res.json({
      success: true,
      count: sortedIngredients.length,
      data: sortedIngredients
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ingredients list'
    });
  }
});

// GET /api/recipes/debug/search/:ingredient - Debug ingredient search
router.get('/debug/search/:ingredient', (req, res) => {
  try {
    const ingredient = req.params.ingredient.toLowerCase();
    const allRecipes = require('../data/recipes.json');
    
    const matchingRecipes = allRecipes.filter(recipe => {
      return recipe.ingredients.some(ing => 
        ing.name.toLowerCase().includes(ingredient)
      );
    });
    
    res.json({
      success: true,
      searchIngredient: ingredient,
      count: matchingRecipes.length,
      recipes: matchingRecipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients.map(ing => ing.name)
      }))
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Debug search failed'
    });
  }
});

// GET /api/recipes/debug/strict-test/:ingredients - Test STRICT matching
router.get('/debug/strict-test/:ingredients', (req, res) => {
  try {
    const ingredientsParam = decodeURIComponent(req.params.ingredients);
    const ingredients = ingredientsParam.split(',').map(ing => ing.trim().toLowerCase());
    
    console.log("🧪 STRICT TEST with ingredients:", ingredients);
    
    const matchingRecipes = RecipeMatcher.findMatchingRecipes(ingredients, {});
    
    res.json({
      success: true,
      testIngredients: ingredients,
      requirement: "ALL ingredients must be present",
      count: matchingRecipes.length,
      data: matchingRecipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients.map(ing => ing.name)
      }))
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Strict test failed'
    });
  }
});

// GET /api/recipes/debug/strict-test2 - Alternative strict test
router.get('/debug/strict-test2', (req, res) => {
  try {
    const { ingredients } = req.query;
    
    if (!ingredients) {
      return res.status(400).json({
        success: false,
        error: 'Ingredients parameter is required'
      });
    }
    
    const ingredientsArray = ingredients.split(',').map(ing => ing.trim().toLowerCase());
    
    console.log("🧪 STRICT TEST 2 with ingredients:", ingredientsArray);
    
    const matchingRecipes = RecipeMatcher.findMatchingRecipes(ingredientsArray, {});
    
    res.json({
      success: true,
      testIngredients: ingredientsArray,
      requirement: "ALL ingredients must be present",
      count: matchingRecipes.length,
      data: matchingRecipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients.map(ing => ing.name)
      }))
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Strict test failed'
    });
  }
});

// GET /api/recipes/debug/routes - Show all available routes
router.get('/debug/routes', (req, res) => {
  try {
    const routes = [];
    
    router.stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
        routes.push({
          method: methods,
          path: middleware.route.path
        });
      }
    });
    
    console.log("🔧 AVAILABLE ROUTES:");
    routes.forEach(route => {
      console.log(`   ${route.method} ${route.path}`);
    });
    
    res.json({
      success: true,
      count: routes.length,
      routes: routes
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get routes'
    });
  }
});

module.exports = router;