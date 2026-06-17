/**
 * Centralized dish registry.
 * To add a new dish:
 *  1. Place the .glb file in /models/
 *  2. Add an entry below
 * That's it — no other changes needed.
 */

const GITHUB_CDN =
  "https://cdn.jsdelivr.net/gh/abdullah880/ar-restaurant-menu@main";

const DISHES = {
  butter_chicken: {
    id: "butter_chicken",
    name: "Butter Chicken",
    model: `${GITHUB_CDN}/models/butter_chicken.glb`,
    description:
      "Tender tandoor-kissed chicken simmered in a velvety tomato-cream sauce spiced with garam masala, fenugreek, and hand-ground Kashmiri chilies. Served with garlic naan.",
    price: "$19.00",
    prepTime: "20 min",
    calories: "740 kcal",
    badge: "Staff Favourite",
    poster: `${GITHUB_CDN}/models/butter_chicken-poster.png`,
    tags: ["indian", "chicken"],
  },
  pad_thai: {
    id: "pad_thai",
    name: "Pad Thai",
    model: `${GITHUB_CDN}/models/pad_thai.glb`,
    description:
      "Wok-tossed rice noodles with tiger prawns, crispy tofu, bean sprouts, and green onions in a tamarind-palm sugar glaze, topped with crushed peanuts and a lime wedge.",
    price: "$17.50",
    prepTime: "14 min",
    calories: "620 kcal",
    badge: "Street Classic",
    poster: `${GITHUB_CDN}/models/pad_thai-poster.png`,
    tags: ["thai", "seafood"],
  },
  peking_duck: {
    id: "peking_duck",
    name: "Peking Duck Wrap",
    model: `${GITHUB_CDN}/models/peking_duck.glb`,
    description:
      "Crispy lacquered duck with paper-thin pancakes, julienned cucumber, spring onion, and hoisin sauce — a centuries-old Beijing classic reimagined for the table.",
    price: "$26.00",
    prepTime: "25 min",
    calories: "680 kcal",
    badge: "House Special",
    poster: `${GITHUB_CDN}/models/peking_duck-poster.png`,
    tags: ["chinese", "duck"],
  },

  // ── Appetizers / Starters ──────────────────────────────────────────────
  bruschetta: {
    id: "bruschetta",
    name: "Tomato Bruschetta",
    model: `${GITHUB_CDN}/models/bruschetta.glb`,
    description:
      "Grilled sourdough rubbed with garlic and topped with marinated heirloom tomatoes, fresh basil chiffonade, shaved pecorino, and a drizzle of aged balsamic.",
    price: "$9.50",
    prepTime: "6 min",
    calories: "290 kcal",
    badge: "Light Bite",
    poster: `${GITHUB_CDN}/models/bruschetta-poster.png`,
    tags: ["vegetarian", "italian"],
  },
  soup_dumpling: {
    id: "soup_dumpling",
    name: "Soup Dumplings (Xiao Long Bao)",
    model: `${GITHUB_CDN}/models/soup_dumpling.glb`,
    description:
      "Steamed hand-folded dumplings filled with rich pork and ginger broth that bursts on the first bite. Served in a bamboo basket with black vinegar and ginger strips.",
    price: "$12.00",
    prepTime: "12 min",
    calories: "320 kcal",
    badge: "Dim Sum",
    poster: `${GITHUB_CDN}/models/soup_dumpling-poster.png`,
    tags: ["chinese", "pork"],
  },
  burger: {
    id: "burger",
    name: "Classic Burger",
    model: `${GITHUB_CDN}/models/burger.glb`,
    description:
      "Juicy beef patty with melted cheddar, crisp lettuce, vine-ripened tomato, and our signature house sauce on a toasted brioche bun.",
    price: "$14.50",
    prepTime: "12 min",
    calories: "680 kcal",
    badge: "Chef's Choice",
    poster: `${GITHUB_CDN}/models/burger-poster.png`,
    tags: ["signature", "beef"],
  },
  pizza: {
    id: "pizza",
    name: "Italian Pizza Margherita",
    model: `${GITHUB_CDN}/models/pizza.glb`,
    description:
      "Wood-fired Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella di bufala, basil, and extra virgin olive oil.",
    price: "$18.00",
    prepTime: "15 min",
    calories: "820 kcal",
    badge: "Wood-Fired",
    poster: `${GITHUB_CDN}/models/pizza-poster.png`,
    tags: ["vegetarian", "italian"],
  },
  sushi: {
    id: "sushi",
    name: "Sushi Platter",
    model: `${GITHUB_CDN}/models/sushi.glb`,
    description:
      "Chef's selection of 12 pieces featuring premium salmon, tuna, yellowtail, and sweet shrimp nigiri with fresh wasabi.",
    price: "$28.00",
    prepTime: "10 min",
    calories: "450 kcal",
    badge: "Premium",
    poster: `${GITHUB_CDN}/models/sushi-poster.png`,
    tags: ["seafood", "japanese"],
  },
  pasta: {
    id: "pasta",
    name: "Truffle Tagliatelle",
    model: `${GITHUB_CDN}/models/pasta.glb`,
    description:
      "Hand-rolled egg tagliatelle tossed in a silky parmesan cream sauce with freshly shaved black truffle and toasted pine nuts.",
    price: "$22.00",
    prepTime: "18 min",
    calories: "720 kcal",
    badge: "Signature",
    poster: `${GITHUB_CDN}/models/pasta-poster.png`,
    tags: ["italian", "truffle"],
  },
  steak: {
    id: "steak",
    name: "Prime Ribeye Steak",
    model: `${GITHUB_CDN}/models/steak.glb`,
    description:
      "28-day dry-aged USDA Prime ribeye, grilled over charcoal, served with roasted garlic butter, seasonal vegetables, and truffle fries.",
    price: "$42.00",
    prepTime: "22 min",
    calories: "950 kcal",
    badge: "Premium",
    poster: `${GITHUB_CDN}/models/steak-poster.png`,
    tags: ["beef", "premium"],
  },
};

// Make globally available
window.DISHES = DISHES;
