/**
 * dishes.js — Dish Registry
 *
 * To add a dish:
 *   1. Drop the .glb (and optional .usdz) into /models/
 *   2. Add one entry to DISHES below.
 *   No other changes needed.
 */

/** @type {string} CDN base for all model assets */
const CDN = "https://cdn.jsdelivr.net/gh/abdullah880/ar-restaurant-menu@main";

/**
 * @typedef {Object} Dish
 * @property {string}   id
 * @property {string}   name
 * @property {string}   model       - URL to .glb file
 * @property {string}   [iosSrc]    - URL to .usdz file (required for iOS AR)
 * @property {string}   [poster]    - URL to poster image shown while model loads
 * @property {string}   description
 * @property {string}   price       - Formatted price string, e.g. "$19.00"
 * @property {string}   prepTime    - e.g. "20 min"
 * @property {string}   calories    - e.g. "740 kcal"
 * @property {string}   badge       - Short label shown in the badge chip
 * @property {string[]} tags        - Category/ingredient tags for filtering
 * @property {string}   [cameraOrbit] - Default orbit for model-viewer, e.g. "0deg 75deg 105%"
 */

/** @type {Record<string, Dish>} */
export const DISHES = {
  // ── Mains ──────────────────────────────────────────────────────────────────
  butter_chicken: {
    id: "butter_chicken",
    name: "Butter Chicken",
    model: `${CDN}/models/butter_chicken.glb`,
    iosSrc: `${CDN}/models/butter_chicken.usdz`,
    poster: `${CDN}/models/butter_chicken-poster.webp`,
    description:
      "Tender tandoor-kissed chicken simmered in a velvety tomato-cream sauce spiced with garam masala, fenugreek, and hand-ground Kashmiri chilies. Served with garlic naan.",
    price: "$19.00",
    prepTime: "20 min",
    calories: "740 kcal",
    badge: "Staff Favourite",
    tags: ["indian", "chicken"],
  },
  pad_thai: {
    id: "pad_thai",
    name: "Pad Thai",
    model: `${CDN}/models/pad_thai.glb`,
    iosSrc: `${CDN}/models/pad_thai.usdz`,
    poster: `${CDN}/models/pad_thai-poster.webp`,
    description:
      "Wok-tossed rice noodles with tiger prawns, crispy tofu, bean sprouts, and green onions in a tamarind-palm sugar glaze, topped with crushed peanuts and a lime wedge.",
    price: "$17.50",
    prepTime: "14 min",
    calories: "620 kcal",
    badge: "Street Classic",
    tags: ["thai", "seafood"],
  },
  peking_duck: {
    id: "peking_duck",
    name: "Peking Duck Wrap",
    model: `${CDN}/models/peking_duck.glb`,
    iosSrc: `${CDN}/models/peking_duck.usdz`,
    poster: `${CDN}/models/peking_duck-poster.webp`,
    description:
      "Crispy lacquered duck with paper-thin pancakes, julienned cucumber, spring onion, and hoisin sauce — a centuries-old Beijing classic reimagined for the table.",
    price: "$26.00",
    prepTime: "25 min",
    calories: "680 kcal",
    badge: "House Special",
    tags: ["chinese", "duck"],
  },
  steak: {
    id: "steak",
    name: "Prime Ribeye Steak",
    model: `${CDN}/models/steak.glb`,
    iosSrc: `${CDN}/models/steak.usdz`,
    poster: `${CDN}/models/steak-poster.webp`,
    description:
      "28-day dry-aged USDA Prime ribeye, grilled over charcoal, served with roasted garlic butter, seasonal vegetables, and truffle fries.",
    price: "$42.00",
    prepTime: "22 min",
    calories: "950 kcal",
    badge: "Premium",
    tags: ["beef", "premium"],
    cameraOrbit: "0deg 60deg 120%",
  },
  pasta: {
    id: "pasta",
    name: "Truffle Tagliatelle",
    model: `${CDN}/models/pasta.glb`,
    iosSrc: `${CDN}/models/pasta.usdz`,
    poster: `${CDN}/models/pasta-poster.webp`,
    description:
      "Hand-rolled egg tagliatelle tossed in a silky parmesan cream sauce with freshly shaved black truffle and toasted pine nuts.",
    price: "$22.00",
    prepTime: "18 min",
    calories: "720 kcal",
    badge: "Signature",
    tags: ["italian", "truffle"],
  },
  pizza: {
    id: "pizza",
    name: "Italian Pizza Margherita",
    model: `${CDN}/models/pizza.glb`,
    iosSrc: `${CDN}/models/pizza.usdz`,
    poster: `${CDN}/models/pizza-poster.webp`,
    description:
      "Wood-fired Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella di bufala, basil, and extra virgin olive oil.",
    price: "$18.00",
    prepTime: "15 min",
    calories: "820 kcal",
    badge: "Wood-Fired",
    tags: ["vegetarian", "italian"],
    cameraOrbit: "0deg 85deg 100%",
  },

  // ── Starters ───────────────────────────────────────────────────────────────
  burger: {
    id: "burger",
    name: "Classic Burger",
    model: `${CDN}/models/burger.glb`,
    iosSrc: `${CDN}/models/burger.usdz`,
    poster: `${CDN}/models/burger-poster.webp`,
    description:
      "Juicy beef patty with melted cheddar, crisp lettuce, vine-ripened tomato, and our signature house sauce on a toasted brioche bun.",
    price: "$14.50",
    prepTime: "12 min",
    calories: "680 kcal",
    badge: "Chef's Choice",
    tags: ["signature", "beef"],
  },
  sushi: {
    id: "sushi",
    name: "Sushi Platter",
    model: `${CDN}/models/sushi.glb`,
    iosSrc: `${CDN}/models/sushi.usdz`,
    poster: `${CDN}/models/sushi-poster.webp`,
    description:
      "Chef's selection of 12 pieces featuring premium salmon, tuna, yellowtail, and sweet shrimp nigiri with fresh wasabi.",
    price: "$28.00",
    prepTime: "10 min",
    calories: "450 kcal",
    badge: "Premium",
    tags: ["seafood", "japanese"],
  },
  bruschetta: {
    id: "bruschetta",
    name: "Tomato Bruschetta",
    model: `${CDN}/models/bruschetta.glb`,
    iosSrc: `${CDN}/models/bruschetta.usdz`,
    poster: `${CDN}/models/bruschetta-poster.webp`,
    description:
      "Grilled sourdough rubbed with garlic and topped with marinated heirloom tomatoes, fresh basil chiffonade, shaved pecorino, and a drizzle of aged balsamic.",
    price: "$9.50",
    prepTime: "6 min",
    calories: "290 kcal",
    badge: "Light Bite",
    tags: ["vegetarian", "italian"],
  },
  soup_dumpling: {
    id: "soup_dumpling",
    name: "Soup Dumplings (Xiao Long Bao)",
    model: `${CDN}/models/soup_dumpling.glb`,
    iosSrc: `${CDN}/models/soup_dumpling.usdz`,
    poster: `${CDN}/models/soup_dumpling-poster.webp`,
    description:
      "Steamed hand-folded dumplings filled with rich pork and ginger broth that bursts on the first bite. Served in a bamboo basket with black vinegar and ginger strips.",
    price: "$12.00",
    prepTime: "12 min",
    calories: "320 kcal",
    badge: "Dim Sum",
    tags: ["chinese", "pork"],
  },
};
