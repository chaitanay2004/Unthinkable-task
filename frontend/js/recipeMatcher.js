class RecipeMatcher {
    static getPersonalizedSuggestions(favorites, ratings, allRecipes, limit = 6) {
        const userPreferences = this.analyzeUserPreferences(favorites, ratings);
        const scoredRecipes = allRecipes.map(recipe => ({
            recipe,
            score: this.calculateRecipeScore(recipe, userPreferences, ratings)
        }));

        // Sort by score descending and return top recipes
        return scoredRecipes
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => ({
                ...item.recipe,
                suggestionReason: this.getSuggestionReason(item.recipe, userPreferences, item.score)
            }));
    }

    static analyzeUserPreferences(favorites, ratings) {
        const preferences = {
            cuisines: {},
            dietary: {},
            cookingTime: 0,
            difficulty: {},
            ingredients: {}
        };

        // Analyze favorites
        favorites.forEach(recipeId => {
            const recipe = this.getRecipeById(recipeId);
            if (recipe) {
                // Track cuisines
                preferences.cuisines[recipe.cuisine] = (preferences.cuisines[recipe.cuisine] || 0) + 1;
                
                // Track dietary preferences
                recipe.dietary?.forEach(diet => {
                    preferences.dietary[diet] = (preferences.dietary[diet] || 0) + 1;
                });

                // Track cooking time preference
                preferences.cookingTime += recipe.cookingTime;

                // Track difficulty
                preferences.difficulty[recipe.difficulty] = (preferences.difficulty[recipe.difficulty] || 0) + 1;

                // Track ingredients
                recipe.ingredients?.forEach(ing => {
                    preferences.ingredients[ing.name] = (preferences.ingredients[ing.name] || 0) + 1;
                });
            }
        });

        // Analyze ratings
        Object.entries(ratings).forEach(([recipeId, rating]) => {
            const recipe = this.getRecipeById(recipeId);
            if (recipe && rating >= 4) {
                // High-rated recipes influence preferences more
                preferences.cuisines[recipe.cuisine] = (preferences.cuisines[recipe.cuisine] || 0) + rating;
                recipe.dietary?.forEach(diet => {
                    preferences.dietary[diet] = (preferences.dietary[diet] || 0) + rating;
                });
            }
        });

        // Calculate averages
        if (favorites.length > 0) {
            preferences.cookingTime = preferences.cookingTime / favorites.length;
        }

        return preferences;
    }

    static calculateRecipeScore(recipe, userPreferences, ratings) {
        let score = 0;

        // Base score
        score += 10;

        // Cuisine preference (30% weight)
        const cuisineScore = userPreferences.cuisines[recipe.cuisine] || 0;
        score += cuisineScore * 0.3;

        // Dietary preference match (25% weight)
        let dietaryScore = 0;
        recipe.dietary?.forEach(diet => {
            dietaryScore += userPreferences.dietary[diet] || 0;
        });
        score += dietaryScore * 0.25;

        // Cooking time preference (15% weight)
        const timeDiff = Math.abs(recipe.cookingTime - userPreferences.cookingTime);
        const timeScore = Math.max(0, 100 - timeDiff) / 100;
        score += timeScore * 15;

        // Difficulty preference (10% weight)
        const difficultyScore = userPreferences.difficulty[recipe.difficulty] || 0;
        score += difficultyScore * 0.1;

        // Ingredient overlap (20% weight)
        let ingredientScore = 0;
        recipe.ingredients?.forEach(ing => {
            ingredientScore += userPreferences.ingredients[ing.name] || 0;
        });
        score += ingredientScore * 0.2;

        // Existing rating boost
        if (ratings[recipe.id] >= 4) {
            score += 20;
        } else if (ratings[recipe.id] >= 3) {
            score += 10;
        }

        // Penalty for already highly rated recipes to encourage discovery
        if (ratings[recipe.id] >= 4) {
            score *= 0.7;
        }

        return Math.round(score * 100) / 100;
    }

    static getSuggestionReason(recipe, preferences, score) {
        const reasons = [];

        if (preferences.cuisines[recipe.cuisine] > 5) {
            reasons.push(`You love ${recipe.cuisine} cuisine`);
        }

        if (recipe.dietary?.some(diet => preferences.dietary[diet] > 3)) {
            const preferredDiet = recipe.dietary.find(diet => preferences.dietary[diet] > 3);
            reasons.push(`Matches your ${preferredDiet} preference`);
        }

        if (Math.abs(recipe.cookingTime - preferences.cookingTime) < 15) {
            reasons.push('Perfect cooking time for you');
        }

        if (preferences.difficulty[recipe.difficulty] > 2) {
            reasons.push(`Right difficulty level for you`);
        }

        const commonIngredients = recipe.ingredients?.filter(ing => 
            preferences.ingredients[ing.name] > 2
        ).length || 0;

        if (commonIngredients > 2) {
            reasons.push('Uses ingredients you frequently enjoy');
        }

        return reasons.length > 0 ? reasons.join(' • ') : 'You might enjoy this new recipe!';
    }

    static getRecipeById(recipeId) {
        // This would typically come from your data source
        // For now, we'll handle this in app.js
        return null;
    }
}