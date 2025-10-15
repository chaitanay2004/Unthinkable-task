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
    console.log('Creating card for recipe:', recipe.name, 'User rating:', userRating);
    
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
        <div class="recipe-image">
            <i class="fas fa-utensils"></i>
            <div class="recipe-actions">
                <button class="action-btn favorite ${isFavorite ? 'active' : ''}" onclick="App.toggleFavorite(${recipe.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
        <div class="recipe-content">
            <div class="recipe-header">
                <h3 class="recipe-title">${recipe.name}</h3>
                <div class="recipe-rating">
                    <i class="fas fa-star"></i>
                    <span>${userRating > 0 ? userRating.toFixed(1) : (recipe.rating || '4.5')}</span>
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
            <div class="user-rating-display" style="margin: 10px 0; font-size: 0.9rem; color: var(--warning-color);">
                ${userRating > 0 ? `Your rating: ${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)}` : ''}
            </div>
            <div class="recipe-tags">
                ${recipe.dietary?.map(diet => `<span class="recipe-tag">${diet}</span>`).join('') || ''}
            </div>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking on action buttons
        if (!e.target.closest('.recipe-actions')) {
            App.showRecipeDetails(recipe.id);
        }
    });
    
    return card;
}

    static createSuggestionCard(recipe, reason, isFavorite = false, userRating = 0) {
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
        <div class="recipe-rating" style="margin: 10px 0;">
            <i class="fas fa-star"></i>
            <span>${userRating > 0 ? userRating.toFixed(1) : (recipe.rating || '4.5')}</span>
            ${userRating > 0 ? `<span style="color: var(--warning-color); margin-left: 8px;">Your rating: ${userRating}/5</span>` : ''}
        </div>
        <p class="recipe-description">${recipe.description}</p>
        <div class="suggestion-reason">
            <i class="fas fa-lightbulb"></i> ${reason}
        </div>
        <button class="btn-primary" onclick="App.showRecipeDetails(${recipe.id})" style="margin-top: 15px; width: 100%;">
            <i class="fas fa-eye"></i> View Recipe
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

    static createRatingStars(recipeId, userRating = 0) {
    console.log('🎯 CREATE RATING STARS - Recipe:', recipeId, 'Current Rating:', userRating);
    
    const container = document.createElement('div');
    container.className = 'rating-system';
    container.style.margin = '20px 0';
    container.style.padding = '15px';
    container.style.background = 'rgba(248, 249, 250, 0.8)';
    container.style.borderRadius = 'var(--border-radius)';
    
    const label = document.createElement('div');
    label.textContent = 'Rate this recipe:';
    label.style.marginBottom = '10px';
    label.style.fontWeight = '600';
    label.style.color = 'var(--dark-color)';
    container.appendChild(label);
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'rating-stars';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = `rating-star ${i <= userRating ? 'active' : ''}`;
        star.innerHTML = '★';
        star.dataset.rating = i;
        star.style.cssText = `
            font-size: 2rem;
            color: ${i <= userRating ? '#FFD700' : '#E0E0E0'};
            cursor: pointer;
            transition: all 0.2s ease;
            margin: 0 2px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        // Add hover effect
        star.addEventListener('mouseenter', () => {
            starsContainer.querySelectorAll('.rating-star').forEach((s, index) => {
                s.style.color = index + 1 <= i ? '#FFA500' : '#E0E0E0';
            });
        });
        
        star.addEventListener('mouseleave', () => {
            starsContainer.querySelectorAll('.rating-star').forEach((s, index) => {
                s.style.color = index + 1 <= userRating ? '#FFD700' : '#E0E0E0';
            });
        });
        
        star.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            console.log('🌟 STAR CLICKED - Rating:', i, 'Recipe:', recipeId);
            
            // Update visual state immediately
            starsContainer.querySelectorAll('.rating-star').forEach((s, index) => {
                const shouldBeActive = index + 1 <= i;
                s.classList.toggle('active', shouldBeActive);
                s.style.color = shouldBeActive ? '#FFD700' : '#E0E0E0';
            });
            
            // Call the rating function
            App.rateRecipe(recipeId, i);
        });
        
        starsContainer.appendChild(star);
    }
    
    container.appendChild(starsContainer);
    
    // Add current rating display
    const ratingDisplay = document.createElement('div');
    ratingDisplay.style.marginTop = '10px';
    ratingDisplay.style.fontSize = '0.9rem';
    ratingDisplay.style.color = 'var(--text-light)';
    ratingDisplay.innerHTML = userRating > 0 
        ? `Your rating: <strong>${userRating}/5</strong> ${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)}`
        : 'Not rated yet';
    ratingDisplay.id = `rating-display-${recipeId}`;
    container.appendChild(ratingDisplay);
    
    return container;
}
}