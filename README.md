# Cronometer Keyboard Plugin

A Chrome extension that supercharges Cronometer's Custom Foods page with keyboard navigation and AI-powered auto-fill. Enter nutritional data 10x faster!

## 🚀 Features

### ⌨️ Full Keyboard Navigation

Navigate between nutrition fields without touching your mouse:

- **Tab** - Jump to the next field
- **Shift+Tab** - Go back to the previous field
- **Enter** - Save current value and move to next field

No more clicking into each of 80+ fields individually!

### 🤖 AI-Powered Auto-Fill

Ask Claude AI to analyze a food photo and paste the nutritional breakdown directly into Cronometer:

1. Send Claude a photo: *"Analyze this chocolate cake and estimate nutrition per 100g"*
2. Copy Claude's response (with values like "Energy: 380 kcal", "Protein: 3.5 g", etc.)
3. Paste anywhere on the Custom Foods page
4. **86+ fields auto-filled instantly!** ✨

The plugin intelligently:
- Parses nutritional data from natural language
- Matches labels to fields (handles variations like "Fiber" vs "Fibre")
- Validates units before filling
- Highlights filled fields with a green flash
- Shows a notification with how many fields were filled

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

### Basic Navigation

1. Navigate to Foods → Custom Foods in Cronometer
2. All nutrition value fields are now proper input boxes
3. Click on any field (or press Tab to reach it)
4. Type a value and press Tab or Enter to move to the next field
5. Fill in your data at lightning speed!

### Auto-Fill from Claude

1. **Take a photo** of your food or describe it to Claude

2. **Ask Claude for nutrition data**:
   ```
   Please analyze this chocolate cake and provide detailed
   nutritional values per 100g in the format:
   Label: Value Unit
   ```

3. **Copy Claude's response** (it will format it like):
   ```
   Energy: 380 kcal
   Protein: 3.5 g
   Fat: 17 g
   Carbohydrates: 52 g
   ...
   ```

4. **Paste on the Custom Foods page** (Ctrl+V / Cmd+V)

5. **Watch the magic** - Fields auto-fill with green highlights! 🎉

## 🛠️ How It Works

### Keyboard Navigation

The plugin converts all nutrition value `<div>` elements into `<input>` fields on page load:

1. Detects when you're on `cronometer.com/#custom-foods`
2. Finds all editable value cells in nutrition tables
3. Replaces `<div class="gwt-Label">` elements with `<input class="number-box">` elements
4. Preserves existing values during conversion
5. Tab navigation now works natively!

### Auto-Fill Parser

When you paste text, the plugin:

1. Captures the paste event
2. Parses each line looking for the pattern: `Label: Number Unit`
3. Normalizes labels (removes punctuation, lowercase, handles whitespace)
4. Matches against Cronometer field labels
5. Validates units match (handles variations like µg/μg/mcg)
6. Fills matching fields and highlights them green
7. Shows a notification with the count of filled fields

### Technical Stack

- **Manifest V3** - Modern Chrome extension standard
- **Vanilla JavaScript** - No dependencies, lightweight and fast
- **MutationObserver** - Monitors for URL changes in single-page app
- **Smart label matching** - Handles variations and synonyms
- **GWT compatibility** - Works with Cronometer's Google Web Toolkit architecture

## 🎨 What Problem Does This Solve?

Cronometer is fantastic for tracking nutrition, but entering custom foods is tedious:

**Before this plugin:**
- Click into first field → Type → Click into second field → Type → Repeat 80+ times
- 5-10 minutes per food entry
- High chance of errors from repetitive clicking

**With this plugin:**
- Tab through fields OR paste Claude's analysis once
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
