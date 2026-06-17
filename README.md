# AR Restaurant Menu

Experience our dishes in Augmented Reality. Scan, view, and explore our menu items in 3D right on your table.

![AR Menu Preview](models/pizza-poster.png)

## Features

- 🎯 **3D Model Viewer** - View dishes in stunning 3D detail using Google's Model Viewer
- 📱 **Augmented Reality** - Place dishes on your table using WebXR/AR
- 📲 **PWA Support** - Install as a Progressive Web App for offline access
- 🔗 **Shareable Links** - Share specific dishes via URL parameters
- 🎨 **Responsive Design** - Works seamlessly on mobile and desktop
- ⚡ **Fast Loading** - Optimized assets with loading states and error handling

## Available Dishes

| Dish | Price | Prep Time | Calories |
|------|-------|-----------|----------|
| Butter Chicken | $19.00 | 20 min | 740 kcal |
| Pad Thai | $17.50 | 14 min | 620 kcal |
| Peking Duck Wrap | $26.00 | 25 min | 680 kcal |
| Tomato Bruschetta | $9.50 | 6 min | 290 kcal |
| Soup Dumplings | $12.00 | 12 min | 320 kcal |
| Burger | $15.00 | 10 min | 850 kcal |
| Pasta | $18.00 | 15 min | 720 kcal |
| Pizza | $20.00 | 12 min | 900 kcal |
| Steak | $32.00 | 18 min | 650 kcal |
| Sushi Platter | $24.00 | 20 min | 480 kcal |

## Usage

### Viewing a Dish

Navigate to the website with a dish ID:

```
https://your-domain.com/?dish=butter_chicken
```

Supported dish IDs:
- `butter_chicken`
- `pad_thai`
- `peking_duck`
- `bruschetta`
- `soup_dumpling`
- `burger`
- `pasta`
- `pizza`
- `steak`
- `sushi`

### Controls

- **Rotate**: Click/touch and drag to rotate the model
- **Zoom**: Pinch or scroll to zoom in/out
- **AR Mode**: Tap the AR button to view in augmented reality (mobile only)
- **Reset View**: Reset the camera to default position
- **Fullscreen**: Toggle fullscreen mode

## Project Structure

```
ar-restaurant-menu/
├── index.html          # Main HTML file with meta tags and structure
├── manifest.json       # PWA manifest for installability
├── sw.js               # Service Worker for offline support
├── robots.txt          # Robots exclusion protocol
├── js/
│   ├── app.js          # Main application logic
│   └── dishes.js       # Dish registry and data
├── styles/
│   └── app.css         # All styles and animations
└── models/
    ├── *.glb           # 3D dish models
    └── *-poster.png    # Poster images for dishes
```

## Technologies Used

- **[Model Viewer](https://modelviewer.dev/)** - 3D/AR viewer component by Google
- **Progressive Web App (PWA)** - Installable web app with offline support
- **Service Worker** - Caching and offline functionality
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No framework dependencies

## Installation & Development

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/abdullah880/ar-restaurant-menu.git
   cd ar-restaurant-menu
   ```

2. Serve the files using any static server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (npx)
   npx serve
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

### Adding New Dishes

1. Place your `.glb` 3D model file in the `/models/` directory
2. Add a poster image (optional) in the `/models/` directory
3. Update `js/dishes.js` with the new dish entry:

```javascript
new_dish: {
  id: "new_dish",
  name: "Dish Name",
  model: `${GITHUB_CDN}/models/new_dish.glb`,
  description: "Description of the dish",
  price: "$XX.XX",
  prepTime: "XX min",
  calories: "XXX kcal",
  badge: "Optional Badge",
  poster: `${GITHUB_CDN}/models/new_dish-poster.png`,
  tags: ["tag1", "tag2"],
}
```

## Deployment

This project can be deployed to any static hosting service:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Cloudflare Pages**

### GitHub Pages

1. Push to a GitHub repository
2. Go to Settings > Pages
3. Select your branch and save

## Browser Support

| Browser | Version | AR Support |
|---------|---------|------------|
| Chrome | 74+ | ✅ Yes |
| Safari | 15+ | ✅ Yes (iOS) |
| Firefox | 90+ | ⚠️ Limited |
| Edge | 79+ | ✅ Yes |

## Performance

- Optimized GLB models with compression
- Lazy loading of 3D assets
- Efficient CSS animations
- Service Worker caching for repeat visits

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or feedback, please open an issue on the GitHub repository.

---

**Enjoy exploring our menu in Augmented Reality!** 🍽️✨
