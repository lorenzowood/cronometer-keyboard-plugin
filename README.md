# Cronometer Auto-Fill Plugin

A Chrome extension that supercharges Cronometer's Custom Foods page with AI-powered auto-fill. Enter nutritional data for custom foods in seconds instead of minutes!

## 🚀 How It Works

### 🤖 AI-Powered Auto-Fill

1. **Ask Claude AI to analyze your food:**
   - Send a photo, description, or both
   - Use the special prompt below to get properly formatted output

2. **Copy Claude's response** (formatted like "Energy: 380 kcal", "Protein: 3.5 g", etc.)

3. **Paste on the Custom Foods page** - The plugin automatically:
   - Parses nutritional data from the text
   - Matches labels to Cronometer fields (handles variations like "Fiber" vs "Fibre")
   - Validates units before filling
   - Simulates clicking and typing into each field
   - Highlights filled fields with a green flash
   - Shows a notification with how many fields were filled

**Result: 86+ fields auto-filled instantly!** ✨

## 📦 Installation

1. **Download or clone this repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cronometer-keyboard-plugin.git
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `cronometer-keyboard-plugin` folder

4. **Start using it!**
   - Go to [cronometer.com/#custom-foods](https://cronometer.com/#custom-foods)
   - All value fields are now input boxes - just Tab through them!

## 🎯 Usage

### Getting Nutrition Data from Claude

Use this prompt with Claude AI (works with photos or descriptions):

```
I use an app called Cronometer to track nutrition. Sometimes I ask you to estimate
the nutritional content of food -- either by describing it, or by showing you a
picture, or both. When I do, please remember:
- Give single-valued answers, not ranges; and
- Give values for all of the following, in this order, using the units shown.
  For each of the nutritions, you must use the format <label> <value> <unit>:

General
Energy,kcal
Alcohol,g
Ash,g
Beta-Hydroxybutyrate,g
Caffeine,mg
Oxalate,mg
Water,g

Carbohydrates
Total Carbs,g
Fibre,g
Starch,g
Sugars,g
Allulose,g
Fructose,g
Galactose,g
Glucose,g
Lactose,g
Maltose,g
Sucrose,g
Added Sugars,g
Sugar Alcohol,g

Lipids
Fat,g
Monounsaturated,g
Polyunsaturated,g
Omega-3,g
Omega-6,g
Saturated,g
Trans-Fat,g
Cholesterol,mg
Phytosterol,mg

Protein
Protein,g
Alanine,g
Arginine,g
Aspartic acid,g
Cystine,g
Glutamic acid,g
Glycine,g
Histidine,g
Hydroxyproline,g
Isoleucine,g
Leucine,g
Lysine,g
Methionine,g
Phenylalanine,g
Proline,g
Serine,g
Threonine,g
Tryptophan,g
Tyrosine,g
Valine,g

Vitamins
B1 (Thiamine),mg
B2 (Riboflavin),mg
B3 (Niacin),mg
B5 (Pantothenic Acid),mg
B6 (Pyridoxine),mg
B12 (Cobalamin),µg
Biotin,µg
Choline,mg
Folate,µg
Vitamin A,µg
Alpha-carotene,µg
Beta-carotene,µg
Beta-cryptoxanthin,µg
Lutein+Zeaxanthin,µg
Lycopene,µg
Retinol,µg
Vitamin C,mg
Vitamin D,IU
Vitamin E,mg
Beta Tocopherol,mg
Delta Tocopherol,mg
Gamma Tocopherol,mg
Vitamin K,µg

Minerals
Calcium,mg
Chromium,µg
Copper,mg
Fluoride,µg
Iodine,µg
Iron,mg
Magnesium,mg
Manganese,mg
Molybdenum,µg
Phosphorus,mg
Potassium,mg
Selenium,µg
Sodium,mg
Zinc,mg
```

### Using the Plugin

1. **Get your data**: Send the prompt above to Claude with your food photo/description
2. **Copy Claude's response** (it will output formatted data like `Energy: 380 kcal`)
3. **Go to Cronometer**: Navigate to Foods → Custom Foods → Create New Food
4. **Paste**: Press Ctrl+V (or Cmd+V on Mac) anywhere on the page
5. **Watch the magic**: Fields auto-fill with green highlights! 🎉

## 🛠️ Technical Details

When you paste text, the plugin:

1. **Captures the paste event** on the Cronometer custom foods page
2. **Parses each line** looking for the pattern: `Label: Number Unit`
3. **Finds matching fields** by searching within `div.food-editor-nutrition-summary` across all nutrition tables
4. **Simulates user interaction** for each field:
   - Clicks on the value cell to activate edit mode
   - Types the value character-by-character
   - Presses Enter to save
5. **Validates everything**:
   - Normalizes labels (removes punctuation, handles whitespace)
   - Matches against Cronometer field labels (handles variations like "Fiber" vs "Fibre")
   - Validates units match (handles µg/μg/mcg variations)
6. **Provides feedback**:
   - Flashes matching fields green
   - Shows notification with count of filled fields

### Technical Stack

- **Manifest V3** - Modern Chrome extension standard
- **Vanilla JavaScript** - No dependencies, lightweight and fast
- **Event simulation** - Programmatically triggers Cronometer's GWT handlers
- **Smart label matching** - Handles variations and synonyms
- **Multi-table search** - Works across all nutrition category tables

## 🎨 What Problem Does This Solve?

Cronometer is fantastic for tracking nutrition, but entering custom foods is tedious:

**Before this plugin:**
- Click into first field → Type → Click into second field → Type → Repeat 86+ times
- 5-10 minutes per food entry
- High chance of errors from repetitive clicking

**With this plugin:**
- Ask Claude to analyze your food (photo or description)
- Paste once on the Custom Foods page
- 30 seconds per food entry
- AI-powered accuracy from Claude's analysis

**Time saved:** ~90% reduction in data entry time!

## 📁 Project Structure

```
cronometer-keyboard-plugin/
├── manifest.json      # Extension configuration (Manifest V3)
├── content.js         # Main script (navigation + auto-fill)
├── .gitignore         # Git ignore patterns
├── example.html       # Sample Cronometer page for testing
└── README.md          # You are here!
```

## 🤝 Contributing

Contributions welcome! Feel free to:

- Report bugs via GitHub Issues
- Suggest new features
- Submit pull requests

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🙏 Credits

- Built with love for faster nutrition tracking
- Inspired by the need to integrate AI analysis with structured data entry
- Thanks to Anthropic's Claude for making AI-powered nutrition analysis possible

## ⚠️ Disclaimer

This is an unofficial plugin not affiliated with Cronometer. Nutritional values from AI should be verified for accuracy. Always consult with healthcare professionals for dietary advice.

---

**Happy tracking! 🥗📊**
