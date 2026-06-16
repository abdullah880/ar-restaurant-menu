/**
 * Centralized dish registry.
 * To add a new dish:
 *  1. Place the .glb file in /models/
 *  2. Add an entry below
 * That's it — no other changes needed.
 */
const DISHES = {
  burger: {
    id: "burger",
    name: "Classic Burger",
    model: "models/burger.glb",
    description:
      "Juicy beef patty with melted cheddar, crisp lettuce, vine-ripened tomato, and our signature house sauce on a toasted brioche bun.",
    price: "$14.50",
    prepTime: "12 min",
    calories: "680 kcal",
    badge: "Chef's Choice",
    poster: "models/burger-poster.png",
    tags: ["signature", "beef"],
  },
  pizza: {
    id: "pizza",
    name: "Italian Pizza Margherita",
    model: "models/pizza.glb",
    description:
      "Wood-fired Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella di bufala, basil, and extra virgin olive oil.",
    price: "$18.00",
    prepTime: "15 min",
    calories: "820 kcal",
    badge: "Wood-Fired",
    poster: "models/pizza-poster.png",
    tags: ["vegetarian", "italian"],
  },
  sushi: {
    id: "sushi",
    name: "Sushi Platter",
    model: "models/sushi.glb",
    description:
      "Chef's selection of 12 pieces featuring premium salmon, tuna, yellowtail, and sweet shrimp nigiri with fresh wasabi.",
    price: "$28.00",
    prepTime: "10 min",
    calories: "450 kcal",
    badge: "Premium",
    poster: "models/sushi-poster.png",
    tags: ["seafood", "japanese"],
  },
  pasta: {
    id: "pasta",
    name: "Truffle Tagliatelle",
    model: "models/pasta.glb",
    description:
      "Hand-rolled egg tagliatelle tossed in a silky parmesan cream sauce with freshly shaved black truffle and toasted pine nuts.",
    price: "$22.00",
    prepTime: "18 min",
    calories: "720 kcal",
    badge: "Signature",
    poster: "models/pasta-poster.png",
    tags: ["italian", "truffle"],
  },
  steak: {
    id: "steak",
    name: "Prime Ribeye Steak",
    model: "models/steak.glb",
    description:
      "28-day dry-aged USDA Prime ribeye, grilled over charcoal, served with roasted garlic butter, seasonal vegetables, and truffle fries.",
    price: "$42.00",
    prepTime: "22 min",
    calories: "950 kcal",
    badge: "Premium",
    poster: "models/steak-poster.png",
    tags: ["beef", "premium"],
  },
};

// Make globally available
window.DISHES = DISHES;
