# 🍳 Smart Recipe Generator

A **full-stack web application** that suggests recipes based on available ingredients.
Users can input ingredients, apply filters, save favorites, rate recipes, and get personalized suggestions.

---

## 🚀 Features

* **Ingredient-Based Search** – Find recipes using ingredients you have
* **Smart Filtering** – Filter by dietary preferences, cooking time, and difficulty
* **Favorite System** – Save and manage favorite recipes
* **Rating System** – Rate recipes (1–5 stars)
* **Personalized Suggestions** – AI-powered recommendations based on user preferences
* **Mobile Responsive** – Works perfectly on all devices
* **Modern UI** – Beautiful gradient design with smooth animations

---

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript
**Backend:** Node.js, Express.js
**Database:** JSON file (for demo)
**Hosting:** Vercel (Frontend), Vercel (Backend)

---

## 📁 Project Structure

```
smart-recipe-generator/
├── frontend/                 # Client-side application
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript modules
│   ├── data/                # Sample data
│   └── index.html           # Main HTML file
├── backend/                 # Server-side application
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Business logic
│   │   ├── data/            # Recipe database
│   │   └── server.js        # Server entry point
│   └── package.json
└── README.md
```

---

## 🎯 Approach

The **Smart Recipe Generator** was built with a *modern web tech stack* focusing on **performance** and **user experience**.
The frontend uses **HTML5**, **CSS3**, and **vanilla JavaScript (ES6+)** for fast loading and smooth interactions, with no external frameworks to ensure optimal performance.
**CSS Grid**, **Flexbox**, and *custom properties* create a **fully responsive design** across all devices.

The backend employs a **RESTful API architecture** with **Node.js** and **Express.js**, providing efficient recipe matching algorithms.
Data persistence is managed through **localStorage** to store user preferences, favorites, and ratings.
The application utilizes **Font Awesome** for icons and follows *modular JavaScript patterns* with clear separation between **UI**, **API**, and **business logic** layers.

Key technical decisions included using a **JSON-based recipe database** for simplicity, implementing a **flexible ingredient matching system** that supports **partial matches**, and building a **personalized suggestion engine** that analyzes user preferences.

The application was designed for a clean separation of concerns with dedicated modules for API communication, UI components, and business logic.

User experience was prioritized through intuitive filtering, responsive layouts, and **localStorage** for persisting user data.
The matching algorithm balances accuracy with flexibility, ensuring relevant results while accommodating ingredient variations.

The entire project was designed to be **easily extensible**, with *clean documentation* and a **modular structure** supporting future **AI integration** and **scalable recipe management**.

---

## 🚀 Quick Start

1. **Backend Setup**

   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npx live-server --port=3000
   ```

3. **Access**

   ```
   http://localhost:3000
   ```

---

## 📝 Evaluation Criteria Met

* ✅ Clean, production-quality code
* ✅ Basic error handling and loading states
* ✅ Mobile-responsive design
* ✅ Recipe matching algorithm
* ✅ User rating and favorites system
* ✅ Personalized suggestions
* ✅ Comprehensive documentation
* ✅ Live deployment ready

---

## 🍳 Key Functionalities

### 1. Search Recipes

* Add ingredients in **Search** tab
* Apply filters (dietary, time, difficulty)
* Click **Find Recipes**

### 2. Image Recognition

* Go to **Image Search** tab
* Upload food image (drag & drop or click)
* AI detects ingredients automatically
* Switch to **Search** tab to find recipes

### 3. Favorites System

* Click heart icon ❤️ on any recipe
* View favorites in **Favorites** tab
* Remove by clicking heart again

### 4. Rate Recipes

* Click any recipe to open details
* Rate with stars ⭐ (1–5)
* Ratings save automatically

### 5. Personalized Suggestions

* **Prerequisite:** Add at least 1 recipe to favorites **OR** rate any recipe
* Go to **Suggestions** tab for recommendations
* Suggestion logic: Based on your favorite recipes and ratings

---

## 💡 Quick Tips

* Start with basic ingredients: `"tomato"`, `"onion"`, `"chicken"`
* Use **image upload** for quick ingredient detection
* Rate recipes to improve suggestions
* Check favorites count to track saved recipes

---

## 🎯 First-Time Setup

1. Add ingredients → Find Recipes
2. Add 2–3 recipes to favorites
3. Rate some recipes
4. Check **Suggestions** tab for personalized recommendations

---

## 🌐 Live URLs

* **BACKEND URL:** https://unthinkable-backend-seven.vercel.app/ 
* **FRONTEND URL:**  https://unthinkable-chaitanay-22bit0001.vercel.app/


