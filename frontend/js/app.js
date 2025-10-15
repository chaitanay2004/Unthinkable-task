class App {
    static init() {
        this.userIngredients = [];
        this.favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
        this.ratings = JSON.parse(localStorage.getItem('recipeRatings')) || {};
        this.allRecipes = [];

        this.bindEvents();
        this.initImageUpload();
        this.loadFeaturedRecipes();
        this.loadAllRecipes();
        this.showTab('search');
        
        console.log("🚀 Smart Recipe Generator initialized with Image Recognition!");
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
            console.log(`Recipe: ${recipe.name}, User Rating: ${userRating}`);
            
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
        console.log('📖 SHOW RECIPE DETAILS - Recipe ID:', recipeId);
        
        const result = await RecipeAPI.getRecipeById(recipeId);
        
        if (result.success) {
            const recipe = result.data;
            const isFavorite = this.favorites.includes(recipe.id);
            const userRating = this.ratings[recipe.id] || 0;
            
            console.log('Recipe loaded:', recipe.name, 'User rating:', userRating);

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

                    <!-- Rating Section -->
                    <div class="rating-section">
                        <h3>Your Rating</h3>
                        <!-- Rating stars will be inserted here -->
                    </div>

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
            
            // Add rating stars after modal is shown
            setTimeout(() => {
                const ratingSection = document.querySelector('.rating-section');
                if (ratingSection) {
                    const ratingStars = UI.createRatingStars(recipeId, userRating);
                    // Replace the placeholder with actual rating stars
                    ratingSection.innerHTML = '<h3>Your Rating</h3>';
                    ratingSection.appendChild(ratingStars);
                }
            }, 100);
            
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
    
    // Always update favorites display, regardless of current tab
    this.updateFavoritesDisplay();
    this.updateSuggestions();
    
    // Also refresh current display if we're on favorites tab
    const currentTab = document.querySelector('.nav-tab.active')?.dataset.tab;
    if (currentTab === 'favorites') {
        this.refreshCurrentDisplay();
    }
}

    static rateRecipe(recipeId, rating) {
        console.log('⭐ RATE RECIPE CALLED - Recipe:', recipeId, 'Rating:', rating);
        
        // Ensure recipeId is a number
        recipeId = parseInt(recipeId);
        rating = parseInt(rating);
        
        // Update ratings object
        this.ratings[recipeId] = rating;
        console.log('Updated ratings:', this.ratings);
        
        // Save to localStorage
        localStorage.setItem('recipeRatings', JSON.stringify(this.ratings));
        console.log('Saved to localStorage');
        
        // Show notification
        UI.showNotification(`Rated ${rating} star${rating > 1 ? 's' : ''}!`, 'success');
        
        // Update ALL displays immediately
        this.refreshCurrentDisplay();
        
        // Close and reopen modal to see updated rating
        const modal = document.getElementById('recipe-modal');
        if (!modal.classList.contains('hidden')) {
            UI.hideRecipeModal();
            // Reopen modal after a short delay to see the updated rating
            setTimeout(() => {
                this.showRecipeDetails(recipeId);
            }, 500);
        }
    }

    // NEW METHOD: Refresh current display after rating
    static refreshCurrentDisplay() {
        const activeTab = document.querySelector('.nav-tab.active')?.dataset.tab;
        console.log('Refreshing current tab:', activeTab);
        
        switch(activeTab) {
            case 'search':
                this.refreshSearchResults();
                break;
            case 'favorites':
                this.updateFavoritesDisplay();
                break;
            case 'suggestions':
                this.updateSuggestions();
                break;
        }
    }

    // NEW METHOD: Refresh search results with updated ratings
    static refreshSearchResults() {
        const recipesContainer = document.getElementById('recipes-container');
        const resultsSection = document.getElementById('results-section');
        
        if (!recipesContainer || resultsSection.classList.contains('hidden')) {
            console.log('Search results not visible, skipping refresh');
            return;
        }
        
        console.log('Refreshing search results display...');
        
        // Update each recipe card with current rating data
        const recipeCards = recipesContainer.querySelectorAll('.recipe-card');
        recipeCards.forEach(card => {
            const recipeTitle = card.querySelector('.recipe-title')?.textContent;
            const recipe = this.allRecipes.find(r => r.name === recipeTitle);
            
            if (recipe) {
                const userRating = this.ratings[recipe.id] || 0;
                const ratingElement = card.querySelector('.recipe-rating span');
                const userRatingDisplay = card.querySelector('.user-rating-display');
                
                if (ratingElement) {
                    // Update the numeric rating
                    ratingElement.textContent = userRating > 0 ? userRating.toFixed(1) : (recipe.rating || '4.5');
                }
                
                if (userRatingDisplay) {
                    // Update the visual star rating
                    userRatingDisplay.innerHTML = userRating > 0 ? 
                        `Your rating: ${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)}` : '';
                }
            }
        });
        
        console.log('Search results refreshed with updated ratings');
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
    const favoritesCount = document.getElementById('favorites-count');
    
    if (!favoritesContainer) {
        console.log('Favorites container not found');
        return;
    }
    
    console.log('Updating favorites display. Current favorites:', this.favorites);
    
    if (this.favorites.length === 0) {
        console.log('No favorites found, showing empty state');
        favoritesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>No favorites yet</h3>
                <p>Start adding recipes to your favorites by clicking the heart icon!</p>
            </div>
        `;
        // Update the count display
        if (favoritesCount) {
            favoritesCount.textContent = '0 recipes';
        }
        return;
    }

    // Find favorite recipes from allRecipes
    const favoriteRecipes = this.allRecipes.filter(recipe => 
        this.favorites.includes(recipe.id)
    );

    console.log('Favorite recipes found:', favoriteRecipes.length);

    // Update the count display
    if (favoritesCount) {
        favoritesCount.textContent = `${favoriteRecipes.length} recipes`;
    }

    if (favoriteRecipes.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart-broken"></i>
                <h3>No favorite recipes found</h3>
                <p>Some recipes may have been removed from our database.</p>
            </div>
        `;
        return;
    }

    // Show favorites grid
    favoritesContainer.innerHTML = `
        <div class="recipes-grid" id="favorites-grid"></div>
    `;

    const grid = document.getElementById('favorites-grid');
    grid.innerHTML = '';
    
    favoriteRecipes.forEach(recipe => {
        const isFavorite = this.favorites.includes(recipe.id);
        const userRating = this.ratings[recipe.id] || 0;
        const card = UI.createRecipeCard(recipe, isFavorite, userRating);
        grid.appendChild(card);
    });
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
            .filter(recipe => !this.favorites.includes(recipe.id))
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
            const isFavorite = this.favorites.includes(recipe.id);
            const userRating = this.ratings[recipe.id] || 0;
            const reason = this.getSuggestionReason(recipe);
            const card = UI.createSuggestionCard(recipe, reason, isFavorite, userRating);
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

    // Image Upload Methods
    static initImageUpload() {
        const imageInput = document.getElementById('image-input');
        const uploadArea = document.getElementById('upload-area');
        
        if (!imageInput || !uploadArea) {
            console.warn('Image upload elements not found');
            return;
        }
        
        // Handle file selection
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.validateAndPreviewImage(file);
            }
        });
        
        // Enhanced drag and drop support
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.validateAndPreviewImage(file);
            } else {
                UI.showNotification('Please drop a valid image file', 'warning');
            }
        });
        
        // Click anywhere on upload area to trigger file input
        uploadArea.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                document.getElementById('image-input').click();
            }
        });
    }

    static validateAndPreviewImage(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            UI.showNotification('Please select an image file', 'warning');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            UI.showNotification('Image size should be less than 5MB', 'warning');
            return;
        }
        
        this.previewImage(file);
    }

    static previewImage(file) {
        const reader = new FileReader();
        const previewImg = document.getElementById('preview-img');
        const imagePreview = document.getElementById('image-preview');
        const uploadArea = document.getElementById('upload-area');
        
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            uploadArea.classList.add('hidden');
            imagePreview.classList.remove('hidden');
            
            UI.showNotification('Image uploaded successfully! Click "Find Ingredients" to analyze.', 'success');
        };
        
        reader.onerror = () => {
            UI.showNotification('Failed to load image', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    static clearImage() {
        const imageInput = document.getElementById('image-input');
        const imagePreview = document.getElementById('image-preview');
        const uploadArea = document.getElementById('upload-area');
        const previewImg = document.getElementById('preview-img');
        
        imageInput.value = '';
        previewImg.src = '';
        imagePreview.classList.add('hidden');
        uploadArea.classList.remove('hidden');
        
        UI.showNotification('Image removed', 'info');
    }

    static async analyzeImage() {
        const imageInput = document.getElementById('image-input');
        const analyzeBtn = document.querySelector('#image-preview .btn-primary');
        
        if (!imageInput.files[0]) {
            UI.showNotification('Please select an image first', 'warning');
            return;
        }
        
        // Show loading state
        const originalText = analyzeBtn.innerHTML;
        analyzeBtn.classList.add('analyzing');
        
        try {
            UI.showNotification('🔍 Analyzing your image for ingredients...', 'info');
            
            const result = await ImageRecognition.analyzeImage(imageInput.files[0]);
            
            analyzeBtn.classList.remove('analyzing');
            analyzeBtn.innerHTML = originalText;
            
            if (result.success) {
                if (result.ingredients.length > 0) {
                    // Add recognized ingredients to the current list
                    let newIngredientsCount = 0;
                    result.ingredients.forEach(ingredient => {
                        if (!this.userIngredients.includes(ingredient)) {
                            this.userIngredients.push(ingredient);
                            newIngredientsCount++;
                        }
                    });
                    
                    this.updateIngredientsList();
                    
                    // Show success message with cuisine theme
                    let successMessage = `Found ${result.ingredients.length} ingredients!`;
                    if (result.cuisine) {
                        successMessage += ` <span class="cuisine-badge">${result.cuisine} theme</span>`;
                    }
                    if (newIngredientsCount < result.ingredients.length) {
                        successMessage += ` (${newIngredientsCount} new ingredients added)`;
                    }
                    
                    // Create temporary element to show formatted message
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = successMessage;
                    UI.showNotification(tempDiv.textContent, 'success');
                    
                    // Clear the image after successful analysis
                    setTimeout(() => {
                        this.clearImage();
                    }, 2000);
                    
                } else {
                    UI.showNotification('No ingredients detected in the image. Try a clearer photo!', 'warning');
                }
            } else {
                UI.showNotification(result.error, 'error');
            }
            
        } catch (error) {
            analyzeBtn.classList.remove('analyzing');
            analyzeBtn.innerHTML = originalText;
            UI.showNotification('Failed to analyze image. Please try again.', 'error');
            console.error('Image analysis error:', error);
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
    static debugFavorites() {
    console.log('=== FAVORITES DEBUG ===');
    console.log('Favorites array:', this.favorites);
    console.log('Favorites length:', this.favorites.length);
    console.log('LocalStorage favorites:', JSON.parse(localStorage.getItem('recipeFavorites') || '[]'));
    console.log('All recipes count:', this.allRecipes.length);
    
    const favoritesContainer = document.getElementById('favorites-container');
    console.log('Favorites container exists:', !!favoritesContainer);
    console.log('Current favorites tab HTML:', favoritesContainer?.innerHTML);
    console.log('========================');
}

// Call this in your init method temporarily
static init() {
    this.userIngredients = [];
    this.favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
    this.ratings = JSON.parse(localStorage.getItem('recipeRatings')) || {};
    this.allRecipes = [];

    this.bindEvents();
    this.initImageUpload();
    this.loadFeaturedRecipes();
    this.loadAllRecipes();
    this.showTab('search');
    
    // Debug
    this.debugFavorites();
    
    console.log("🚀 Smart Recipe Generator initialized with Image Recognition!");
}
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => App.init());