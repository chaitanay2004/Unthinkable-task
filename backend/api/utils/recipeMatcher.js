const recipes = require('../data/recipes.json');

class RecipeMatcher {
    // Find recipes that match ALL given ingredients
    static findMatchingRecipes(userIngredients, filters = {}) {
        const { dietary = '', maxTime = 120, difficulty = '' } = filters;
        
        console.log("🎯 ========== RECIPE SEARCH STARTED ==========");
        console.log("🔍 User Ingredients:", userIngredients);
        console.log("⚙️ Filters:", { dietary, maxTime, difficulty });
        console.log("📊 Total recipes in database:", recipes.length);
        
        if (userIngredients.length === 0) {
            console.log("ℹ️ No ingredients provided - returning filtered recipes");
            return this.getAllRecipesWithFilters(filters);
        }
        
        const matchingRecipes = [];
        
        recipes.forEach(recipe => {
            console.log(`\n🔍 Checking recipe: "${recipe.name}" (ID: ${recipe.id})`);
            
            // Check if recipe contains ALL of the user ingredients
            const hasAllIngredients = this.containsAllIngredients(recipe.ingredients, userIngredients);
            
            // Check dietary restrictions
            const matchesDiet = !dietary || 
                (recipe.dietary && recipe.dietary.includes(dietary.toLowerCase()));
            
            // Check cooking time
            const withinTime = recipe.cookingTime <= maxTime;
            
            // Check difficulty
            const matchesDifficulty = !difficulty || 
                recipe.difficulty.toLowerCase() === difficulty.toLowerCase();
            
            const shouldInclude = hasAllIngredients && matchesDiet && withinTime && matchesDifficulty;
            
            if (shouldInclude) {
                console.log(`✅ INCLUDING: "${recipe.name}" - Contains ALL ingredients`);
                matchingRecipes.push(recipe);
            } else {
                console.log(`❌ EXCLUDING: "${recipe.name}" - Reason:`);
                if (!hasAllIngredients) console.log("   - Missing some ingredients");
                if (!matchesDiet) console.log("   - Doesn't match dietary filter");
                if (!withinTime) console.log("   - Exceeds max cooking time");
                if (!matchesDifficulty) console.log("   - Doesn't match difficulty");
            }
        });
        
        console.log("\n📊 ========== SEARCH RESULTS ==========");
        console.log(`✅ Found ${matchingRecipes.length} recipes matching ALL criteria`);
        
        if (matchingRecipes.length > 0) {
            console.log("📋 Matching recipes:");
            matchingRecipes.forEach((recipe, index) => {
                console.log(`   ${index + 1}. ${recipe.name}`);
                console.log(`      Ingredients: ${recipe.ingredients.map(ing => ing.name).join(', ')}`);
            });
        } else {
            console.log("❌ No recipes found with ALL the specified ingredients");
        }
        
        console.log("==============================================");
        
        return matchingRecipes;
    }

    // STRICT: Check if recipe contains ALL of the user ingredients
    static containsAllIngredients(recipeIngredients, userIngredients) {
        const userIngs = userIngredients.map(ing => ing.toLowerCase().trim());
        const recipeIngs = recipeIngredients.map(ing => ing.name.toLowerCase());
        
        console.log("   🔍 Checking if recipe contains ALL ingredients:");
        console.log("      Required:", userIngs);
        console.log("      Available in recipe:", recipeIngs);
        
        let allFound = true;
        
        // Check if ALL user ingredients are in the recipe
        userIngs.forEach(userIng => {
            const found = recipeIngs.some(recipeIng => {
                // Check if recipe ingredient contains the user ingredient
                const matches = recipeIng.includes(userIng);
                return matches;
            });
            
            if (found) {
                console.log(`      ✅ FOUND: "${userIng}"`);
            } else {
                console.log(`      ❌ MISSING: "${userIng}"`);
                allFound = false;
            }
        });
        
        console.log(`   📊 All ingredients present: ${allFound}`);
        return allFound;
    }

    // Get all recipes with filters (when no ingredients provided)
    static getAllRecipesWithFilters(filters = {}) {
        const { dietary = '', maxTime = 120, difficulty = '' } = filters;
        
        return recipes.filter(recipe => {
            const matchesDiet = !dietary || 
                (recipe.dietary && recipe.dietary.includes(dietary.toLowerCase()));
            
            const withinTime = recipe.cookingTime <= maxTime;
            
            const matchesDifficulty = !difficulty || 
                recipe.difficulty.toLowerCase() === difficulty.toLowerCase();
            
            return matchesDiet && withinTime && matchesDifficulty;
        });
    }

    // Find recipes by name or ingredient search
    static searchRecipes(query, filters = {}) {
        const searchTerm = query.toLowerCase().trim();
        
        return recipes.filter(recipe => {
            const matchesName = recipe.name.toLowerCase().includes(searchTerm);
            const matchesIngredient = recipe.ingredients.some(ing => 
                ing.name.toLowerCase().includes(searchTerm)
            );
            
            const matchesDiet = !filters.dietary || 
                (recipe.dietary && recipe.dietary.includes(filters.dietary.toLowerCase()));
            
            return (matchesName || matchesIngredient) && matchesDiet;
        });
    }

    // Get random featured recipes
    static getFeaturedRecipes(limit = 5) {
        const shuffled = [...recipes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    }

    // Get recipe by ID
    static getRecipeById(id) {
        return recipes.find(recipe => recipe.id === parseInt(id));
    }
}

module.exports = RecipeMatcher;