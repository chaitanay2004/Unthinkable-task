class ImageRecognition {
    static async analyzeImage(imageFile) {
        try {
            // Show loading state
            UI.showNotification('🔍 Analyzing image for ingredients...', 'info');
            
            // In a real application, you would send the image to a backend API
            // For now, we'll simulate the analysis with mock data
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock response - in a real app, this would come from your backend
            const mockResponse = this.getMockAnalysis(imageFile);
            
            return {
                success: true,
                ingredients: mockResponse.ingredients,
                cuisine: mockResponse.cuisine,
                confidence: mockResponse.confidence
            };
            
        } catch (error) {
            console.error('Image analysis error:', error);
            return {
                success: false,
                error: 'Failed to analyze image. Please try again.'
            };
        }
    }

    static getMockAnalysis(imageFile) {
    const fileName = imageFile.name.toLowerCase();
    
    // Simple single ingredient detection
    if (fileName.includes('garlic')) {
        return {
            ingredients: ['garlic'],
            cuisine: 'Mediterranean',
            confidence: 0.90
        };
    } else if (fileName.includes('tomato')) {
        return {
            ingredients: ['tomato'],
            cuisine: 'Italian',
            confidence: 0.90
        };
    } else if (fileName.includes('chicken')) {
        return {
            ingredients: ['chicken'],
            cuisine: 'Various',
            confidence: 0.90
        };
    } else if (fileName.includes('onion')) {
        return {
            ingredients: ['onion'],
            cuisine: 'Various',
            confidence: 0.90
        };
    } else if (fileName.includes('rice')) {
        return {
            ingredients: ['rice'],
            cuisine: 'Asian',
            confidence: 0.90
        };
    }
    // Add more ingredients as needed...
    
    // Default fallback - try to extract from filename
    const filenameWithoutExt = fileName.split('.')[0];
    return {
        ingredients: [filenameWithoutExt || 'ingredient'],
        cuisine: 'Various',
        confidence: 0.70
    };
}

    // Method to simulate actual API call (for future implementation)
    static async callImageRecognitionAPI(imageFile) {
        // This is where you would integrate with a real image recognition API
        // For example: Google Cloud Vision, AWS Rekognition, or a custom ML model
        
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
            const response = await fetch('https://unthinkable-backend-p1j490tsa-chaitanay2004s-projects.vercel.app/api/analyze-image', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('API call failed:', error);
            throw new Error('Image recognition service unavailable');
        }
    }

    // Utility method to validate image
    static validateImage(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Please select a valid image file (JPEG, PNG, or WebP)'
            };
        }

        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'Image size should be less than 5MB'
            };
        }

        return { valid: true };
    }

    // Method to extract text from image (for OCR functionality)
    static async extractTextFromImage(imageFile) {
        // This would use OCR to read text from packaging or labels
        // For now, return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTexts = [
            "Organic Tomatoes, Fresh Basil, Extra Virgin Olive Oil",
            "Chicken Breast, Brown Rice, Mixed Vegetables",
            "Pasta, Parmesan Cheese, Tomato Sauce, Garlic",
            "Salmon, Lemon, Asparagus, Butter, Herbs"
        ];
        
        return mockTexts[Math.floor(Math.random() * mockTexts.length)];
    }
}