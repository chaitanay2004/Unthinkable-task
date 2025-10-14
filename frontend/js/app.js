class App {
    static init() {
        this.userIngredients = [];
        this.favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        this.ratings = JSON.parse(localStorage.getItem('recipeRatings')) || {};
        this.allRecipes = [];

        this.bindEvents();
        this.loadFeaturedRecipes();
        this.loadAllRecipes();
        this.showTab('search');
    }

    static bindEvents() {
        // Ingredient input
        document.getElementById('add-ingredient').addEventListener('click', () => this.addIngredient());
        document.getElementById('ingredient-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addIngredient();
        });

        // Find recipes
        document.getElementById('find-recipes').addEventListener('click', () => this.findRecipes());

        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => UI.hideRecipeModal());

        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.showTab(tabName);
            });
        });
    }

    static addIngredient() {
        const input = document.getElementById('ingredient-input');
        const ingredient = input.value.trim().toLowerCase();

        if (ingredient && !this.userIngredients.includes(ingredient)) {
            this.userIngredients.push(ingredient);
            this.updateIngredientsList();
            input.value = '';
            UI.showNotification(`Added ${ingredient}`, 'success');
        }
    }

    static removeIngredient(ingredient) {
        this.userIngredients = this.userIngredients.filter(ing => ing !== ingredient);
        this.updateIngredientsList();
        UI.showNotification(`Removed ${ingredient}`, 'info');
    }

    static updateIngredientsList() {
        const container = document.getElementById('ingredients-list');
        container.innerHTML = this.userIngredients.map(ingredient => `
            <div class="ingredient-tag">
                ${ingredient}
                <button class="remove" onclick="App.removeIngredient('${ingredient}')">&times;</button>
            </div>
        `).join('');
    }

    static async findRecipes() {
        if (this.userIngredients.length === 0) {
            UI.showNotification('Please add some ingredients first!', 'warning');
            return;
        }

        this.showLoading(true);

        const filters = {
            dietary: document.getElementById('dietary-filter').value,
            maxTime: document.getElementById('time-filter').value,
            difficulty: document.getElementById('difficulty-filter').value
        };

        const result = await RecipeAPI.findRecipesByIngredients(this.userIngredients, filters);

        this.showLoading(false);

        if (result.success) {
            this.displayRecipes(result.data, `Found ${result.count} recipes matching your ingredients`);
        } else {
            UI.showNotification(result.error, 'error');
        }
    }

    static displayRecipes(recipes, title = 'Recipes') {
        const container = document.getElementById('recipes-container');
        const resultsCount = document.getElementById('results-count');
        const resultsSection = document.getElementById('results-section');
        const noResults = document.getElementById('no-results');

        resultsCount.textContent = recipes.length;

        if (recipes.length === 0) {
            resultsSection.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }

        container.innerHTML = '';
        recipes.forEach(recipe => {
            const isFavorite = this.favorites.includes(recipe.id);
            const userRating = this.ratings[recipe.id] || 0;
            const card = UI.createRecipeCard(recipe, isFavorite, userRating);
            container.appendChild(card);
        });

        resultsSection.classList.remove('hidden');
        noResults.classList.add('hidden');

        // Update section title
        const sectionHeader = resultsSection.querySelector('h2');
        sectionHeader.textContent = title;
    }

    static async showRecipeDetails(recipeId) {
        const result = await RecipeAPI.getRecipeById(recipeId);
        
        if (result.success) {
            const recipe = result.data;
            const isFavorite = this.favorites.includes(recipe.id);
            const userRating = this.ratings[recipe.id] || 0;

            const modalContent = `
                <div class="recipe-details">
                    <h2>${recipe.name}</h2>
                    <div class="recipe-meta">
                        <span class="meta-item">
                            <i class="fas fa-clock"></i>
                            ${recipe.cookingTime} minutes
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-signal"></i>
                            ${recipe.difficulty}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-users"></i>
                            ${recipe.servings} servings
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-globe"></i>
                            ${recipe.cuisine}
                        </span>
                    </div>
                    
                    <div class="recipe-actions-modal">
                        <button class="btn-primary" onclick="App.toggleFavorite(${recipe.id})">
                            <i class="fas fa-heart"></i>
                            ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>

                    ${UI.createRatingStars(recipeId, userRating).outerHTML}

                    <div class="nutrition-info">
                        <h3>Nutrition (per serving)</h3>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <span class="nutrition-value">${recipe.nutrition.calories}</span>
                                <span class="nutrition-label">Calories</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-value">${recipe.nutrition.protein}g</span>
                                <span class="nutrition-label">Protein</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-value">${recipe.nutrition.carbs}g</span>
                                <span class="nutrition-label">Carbs</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-value">${recipe.nutrition.fat}g</span>
                                <span class="nutrition-label">Fat</span>
                            </div>
                        </div>
                    </div>

                    <div class="ingredients-section">
                        <h3>Ingredients</h3>
                        <ul class="ingredients-list">
                            ${recipe.ingredients.map(ing => `
                                <li>${ing.quantity} ${ing.unit} ${ing.name}</li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="instructions-section">
                        <h3>Instructions</h3>
                        <ol class="instructions-list">
                            ${recipe.instructions.map((step, index) => `
                                <li>${step}</li>
                            `).join('')}
                        </ol>
                    </div>

                    <div class="dietary-tags">
                        ${recipe.dietary?.map(diet => `<span class="recipe-tag">${diet}</span>`).join('') || ''}
                    </div>
                </div>
            `;

            UI.showRecipeModal(modalContent);
        } else {
            UI.showNotification('Failed to load recipe details', 'error');
        }
    }

    static toggleFavorite(recipeId) {
        const index = this.favorites.indexOf(recipeId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            UI.showNotification('Removed from favorites', 'info');
        } else {
            this.favorites.push(recipeId);
            UI.showNotification('Added to favorites!', 'success');
        }

        localStorage.setItem('recipeFavorites', JSON.stringify(this.favorites));
        this.updateFavoritesDisplay();
        this.updateSuggestions();
    }

    static rateRecipe(recipeId, rating) {
        this.ratings[recipeId] = rating;
        localStorage.setItem('recipeRatings', JSON.stringify(this.ratings));
        
        UI.showNotification(`Rated ${rating} stars!`, 'success');
        this.updateSuggestions();
    }

    static showTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        if (tabName === 'favorites') {
            this.showFavorites();
        } else if (tabName === 'suggestions') {
            this.updateSuggestions();
        }
    }

    static showFavorites() {
        this.updateFavoritesDisplay();
    }

    static updateFavoritesDisplay() {
        const favoritesContainer = document.getElementById('favorites-container');
        
        if (!favoritesContainer) return;
        
        if (this.favorites.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>No favorites yet</h3>
                    <p>Start adding recipes to your favorites by clicking the heart icon!</p>
                </div>
            `;
            return;
        }

        // For now, show a message about favorites count
        // In a real app, you would fetch and display the actual favorite recipes
        favoritesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>Your Favorite Recipes</h3>
                <p>You have ${this.favorites.length} favorite recipes saved!</p>
                <p>Switch to the Search tab to browse and add more favorites.</p>
                <div style="margin-top: 20px; font-size: 0.9rem; color: var(--text-light);">
                    <p><strong>Favorite Recipe IDs:</strong> ${this.favorites.join(', ')}</p>
                </div>
            </div>
        `;
    }

    static updateSuggestions() {
        if (this.allRecipes.length === 0) {
            console.log("No recipes loaded yet for suggestions");
            return;
        }

        const suggestionsContainer = document.getElementById('suggestions-container');
        
        if (!suggestionsContainer) return;

        // Simple suggestions based on favorites
        if (this.favorites.length === 0 && Object.keys(this.ratings).length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-lightbulb"></i>
                    <h3>No suggestions yet</h3>
                    <p>Rate some recipes or add them to favorites to get personalized suggestions!</p>
                </div>
            `;
            return;
        }

        // Get some random recipes as suggestions for now
        const suggestedRecipes = this.allRecipes
            .filter(recipe => !this.favorites.includes(recipe.id)) // Don't suggest already favorited
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        if (suggestedRecipes.length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-lightbulb"></i>
                    <h3>No new suggestions</h3>
                    <p>You've already favorited all our recipes! 🎉</p>
                </div>
            `;
            return;
        }

        suggestionsContainer.innerHTML = `
            <h3>Recommended For You</h3>
            <p>Based on your preferences</p>
            <div class="suggestions-grid" id="suggestions-grid"></div>
        `;

        const grid = document.getElementById('suggestions-grid');
        suggestedRecipes.forEach(recipe => {
            const reason = this.getSuggestionReason(recipe);
            const card = UI.createSuggestionCard(recipe, reason);
            grid.appendChild(card);
        });
    }

    static getSuggestionReason(recipe) {
        const reasons = [
            "Popular choice among users",
            "Matches your cooking style",
            "Quick and easy to make",
            "Uses ingredients you might like",
            "Highly rated by others",
            "Perfect for your skill level"
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    static async loadFeaturedRecipes() {
        const result = await RecipeAPI.getFeaturedRecipes();
        if (result.success) {
            this.displayRecipes(result.data, 'Featured Recipes');
        }
    }

    static async loadAllRecipes() {
        const result = await RecipeAPI.getAllRecipes();
        if (result.success) {
            this.allRecipes = result.data;
        }
    }

    static showLoading(show) {
        const loadingSection = document.getElementById('loading-section');
        const resultsSection = document.getElementById('results-section');
        
        if (show) {
            loadingSection.classList.remove('hidden');
            resultsSection.classList.add('hidden');
        } else {
            loadingSection.classList.add('hidden');
        }
    }

    // Test connection method for debugging
    static async testConnection() {
        console.log("Testing backend connection...");
        
        try {
            const response = await fetch('http://localhost:5001/api/health');
            const data = await response.json();
            console.log('✅ Backend connection successful:', data);
            return true;
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            return false;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => App.init());