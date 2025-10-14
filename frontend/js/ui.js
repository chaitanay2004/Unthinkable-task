class UI {
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    z-index: 1001;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideInRight 0.3s ease;
                }
                .notification-info { background: var(--accent-color); }
                .notification-success { background: var(--success-color); }
                .notification-warning { background: var(--warning-color); }
                .notification-error { background: var(--primary-color); }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Close on click
        notification.querySelector('.notification-close').onclick = () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        };
    }

    static createRecipeCard(recipe, isFavorite = false, userRating = 0) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-image">
                <i class="fas fa-utensils"></i>
                <div class="recipe-actions">
                    <button class="action-btn favorite ${isFavorite ? 'active' : ''}" 
                            onclick="App.toggleFavorite(${recipe.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="recipe-content">
                <div class="recipe-header">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <div class="recipe-rating">
                        <i class="fas fa-star"></i>
                        <span>${this.calculateAverageRating(recipe)}</span>
                    </div>
                </div>
                <div class="recipe-meta">
                    <span class="meta-item">
                        <i class="fas fa-clock"></i>
                        ${recipe.cookingTime} min
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-signal"></i>
                        ${recipe.difficulty}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-users"></i>
                        ${recipe.servings} servings
                    </span>
                </div>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-tags">
                    ${recipe.dietary?.map(diet => `<span class="recipe-tag">${diet}</span>`).join('') || ''}
                    <span class="recipe-tag">${recipe.cuisine}</span>
                </div>
            </div>
        `;

        card.onclick = () => App.showRecipeDetails(recipe.id);
        return card;
    }

    static createSuggestionCard(recipe, reason) {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.innerHTML = `
            <h4>${recipe.name}</h4>
            <div class="recipe-meta">
                <span class="meta-item">
                    <i class="fas fa-clock"></i>
                    ${recipe.cookingTime} min
                </span>
                <span class="meta-item">
                    <i class="fas fa-signal"></i>
                    ${recipe.difficulty}
                </span>
            </div>
            <p class="suggestion-reason">${reason}</p>
            <button class="btn-secondary" onclick="App.showRecipeDetails(${recipe.id})">
                View Recipe
            </button>
        `;
        return card;
    }

    static calculateAverageRating(recipe) {
        // This would typically come from backend ratings
        // For now, return a default or use recipe quality indicator
        const baseRating = 4.0 + (Math.random() * 1.0); // 4.0 - 5.0
        return baseRating.toFixed(1);
    }

    static showRecipeModal(content) {
        const modal = document.getElementById('recipe-modal');
        const modalContent = document.getElementById('modal-recipe-content');
        
        modalContent.innerHTML = content;
        modal.classList.remove('hidden');
        
        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.hideRecipeModal();
            }
        };
        
        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideRecipeModal();
            }
        });
    }

    static hideRecipeModal() {
        document.getElementById('recipe-modal').classList.add('hidden');
    }

    static createRatingStars(recipeId, currentRating = 0) {
        const container = document.createElement('div');
        container.className = 'rating-system';
        container.innerHTML = `
            <span>Rate this recipe:</span>
            <div class="rating-stars">
                ${[1, 2, 3, 4, 5].map(star => `
                    <span class="rating-star ${currentRating >= star ? 'active' : ''}" 
                          data-rating="${star}"
                          onclick="App.rateRecipe(${recipeId}, ${star})">
                        ★
                    </span>
                `).join('')}
            </div>
        `;
        return container;
    }
}