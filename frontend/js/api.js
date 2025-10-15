const API_BASE_URL = 'https://unthinkable-backend-seven.vercel.app/api';

class RecipeAPI {
    static async findRecipesByIngredients(ingredients, filters = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/recipes/find`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredients: ingredients,
                    dietary: filters.dietary || '',
                    maxTime: parseInt(filters.maxTime) || 120,
                    difficulty: filters.difficulty || ''
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { 
                success: false, 
                error: 'Failed to connect to server. Make sure backend is running on port 5000.' 
            };
        }
    }

    static async getAllRecipes() {
        try {
            const response = await fetch(`${API_BASE_URL}/recipes`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Failed to fetch recipes' };
        }
    }

    static async getFeaturedRecipes() {
        try {
            const response = await fetch(`${API_BASE_URL}/recipes/featured?limit=6`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Failed to fetch featured recipes' };
        }
    }

    static async getRecipeById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Failed to fetch recipe details' };
        }
    }

    static async getAllIngredients() {
        try {
            const response = await fetch(`${API_BASE_URL}/ingredients`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Failed to fetch ingredients' };
        }
    }

    static async suggestSubstitutes(ingredient) {
        try {
            const response = await fetch(`${API_BASE_URL}/ingredients/suggest-substitutes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredient })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Failed to fetch substitutes' };
        }
    }
}