// This file contains sample recipe data for frontend testing
// In production, this would come from the backend API

const sampleRecipes = [
    {
        id: 1,
        name: "Vegetable Stir Fry",
        description: "A quick and healthy vegetable stir fry with colorful veggies and savory sauce",
        ingredients: [
            {name: "bell pepper", quantity: "1", unit: "piece", category: "vegetables"},
            {name: "broccoli", quantity: "1", unit: "cup", category: "vegetables"},
            {name: "carrot", quantity: "2", unit: "pieces", category: "vegetables"},
            {name: "soy sauce", quantity: "2", unit: "tbsp", category: "sauces"}
        ],
        cookingTime: 15,
        difficulty: "easy",
        servings: 2,
        dietary: ["vegetarian", "vegan"],
        cuisine: "Asian"
    }
    // Add more sample recipes if needed for frontend testing
];

// Make available globally for development
window.sampleRecipes = sampleRecipes;