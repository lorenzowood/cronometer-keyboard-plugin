// Cronometer Keyboard Plugin
// Auto-fill nutrition fields by simulating user interaction

(function() {
  'use strict';

  console.log('Cronometer Keyboard Plugin loaded');

  // Check if we're on the custom foods page
  function isCustomFoodsPage() {
    return window.location.hash === '#custom-foods' ||
           window.location.href.includes('custom-foods');
  }

  // Set up paste handler
  function setupPasteHandler() {
    document.addEventListener('paste', async function(event) {
      if (!isCustomFoodsPage()) {
        return;
      }

      const pastedText = event.clipboardData.getData('text');
      if (!pastedText) {
        return;
      }

      console.log('Paste detected, parsing nutritional data...');

      // Parse the pasted data
      const parsedData = parsePastedData(pastedText);

      if (parsedData.length === 0) {
        console.log('No valid data found in paste');
        return;
      }

      console.log(`Found ${parsedData.length} entries to fill`);

      // Fill each field by simulating user interaction
      let filledCount = 0;
      for (const entry of parsedData) {
        const success = await fillFieldBySimulation(entry.label, entry.value, entry.unit);
        if (success) {
          filledCount++;
        }
        // Small delay between fields to avoid overwhelming the browser
        await sleep(100);
      }

      if (filledCount > 0) {
        showNotification(`✓ Auto-filled ${filledCount} fields`);
      }
    });

    console.log('Paste handler added');
  }

  // Parse pasted text into structured data
  function parsePastedData(text) {
    const entries = [];
    const lines = text.split('\n');

    // Pattern: Label: Number Unit OR Label Number Unit
    // Examples: "Energy: 380 kcal", "Protein 25.5 g"
    const pattern = /^[•\-\s]*(.+?)[\s:]+(\d+\.?\d*)\s+([a-zA-Zµμ]+)/;

    lines.forEach(line => {
      const match = line.trim().match(pattern);
      if (match) {
        entries.push({
          label: match[1].trim(),
          value: match[2],
          unit: match[3]
        });
      }
    });

    return entries;
  }

  // Fill a field by simulating exact user interaction
  async function fillFieldBySimulation(label, value, unit) {
    // Find the matching row
    const row = findMatchingRow(label, unit);

    if (!row) {
      console.log(`No match found for ${label} (${unit})`);
      return false;
    }

    const cells = row.querySelectorAll('td');
    if (cells.length < 3) {
      return false;
    }

    const valueCell = cells[1]; // Second column has the value

    // Step 1: Check if field is already an input (from previous edit)
    let input = valueCell.querySelector('input');

    if (!input) {
      // Field is not in edit mode, need to click to activate it
      // Find the div to click on (could be gwt-Label or gwt-HTML)
      let valueDiv = valueCell.querySelector('div.gwt-Label') ||
                     valueCell.querySelector('div.gwt-HTML') ||
                     valueCell.querySelector('div');

      if (!valueDiv) {
        console.log(`No div found in value cell for ${label}. Cell HTML:`, valueCell.innerHTML);
        return false;
      }

      console.log(`Clicking on ${label}...`);

      // Try clicking on the cell itself (not the div) - this might work better
      const mousedownEvent = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      const mouseupEvent = new MouseEvent('mouseup', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });

      // Click on the cell, not the div
      valueCell.dispatchEvent(mousedownEvent);
      await sleep(50);
      valueCell.dispatchEvent(mouseupEvent);
      await sleep(50);
      valueCell.dispatchEvent(clickEvent);

      // Wait for the DIV to convert to INPUT
      await sleep(200);

      // Step 2: Verify INPUT was created
      input = valueCell.querySelector('input');
      if (!input) {
        console.log(`Failed to create input for ${label}`);
        return false;
      }
    } else {
      console.log(`${label} already in edit mode, filling directly...`);
    }

    // Step 3: Focus the input and clear it
    input.focus();
    input.select();

    // Step 4: Type the value (simulate character by character)
    input.value = '';
    for (const char of value) {
      input.value += char;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(10);
    }

    // Step 5: Simulate Enter key to confirm the value
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    input.dispatchEvent(enterEvent);

    // Wait for the save to complete
    await sleep(200);

    // Step 6: Verify the INPUT converted back to DIV (indicating save)
    input = valueCell.querySelector('input');
    const div = valueCell.querySelector('div.gwt-Label');

    if (!input && div) {
      console.log(`✓ Successfully filled ${label}: ${value} ${unit}`);

      // Flash the cell green
      valueCell.style.backgroundColor = '#d5f3df';
      setTimeout(() => {
        valueCell.style.backgroundColor = '';
      }, 1000);

      return true;
    } else {
      console.log(`⚠ Value entered but save status unclear for ${label}`);
      return false;
    }
  }

  // Find a table row matching the label and unit
  function findMatchingRow(label, unit) {
    // Constrain search to the food editor's nutrition tables
    const foodEditor = document.querySelector('div.food-editor-nutrition-summary');
    if (!foodEditor) {
      console.log('Food editor not found');
      return null;
    }

    const tables = foodEditor.querySelectorAll('table.crono-table');
    if (tables.length === 0) {
      console.log('No nutrition tables found in food editor');
      return null;
    }

    const normalizedLabel = normalizeLabel(label);

    // Search through all tables
    for (const table of tables) {
      const rows = table.querySelectorAll('tr');

      for (const row of rows) {
        const cells = row.querySelectorAll('td');

        if (cells.length >= 3) {
          // Check label (first cell)
          const labelDiv = cells[0].querySelector('div.gwt-HTML');
          if (!labelDiv) continue;

          const rowLabel = labelDiv.textContent.trim();
          const normalizedRowLabel = normalizeLabel(rowLabel);

          // Check if labels match
          if (!labelsMatch(normalizedLabel, normalizedRowLabel)) {
            continue;
          }

          // Check unit (third cell)
          const unitDiv = cells[2].querySelector('div.gwt-Label');
          if (!unitDiv) continue;

          const rowUnit = unitDiv.textContent.trim();

          // Check if units match
          if (unitsMatch(unit, rowUnit)) {
            return row;
          }
        }
      }
    }

    return null;
  }

  // Normalize label for matching
  function normalizeLabel(label) {
    return label
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
  }

  // Check if two labels match
  function labelsMatch(label1, label2) {
    if (label1 === label2) {
      return true;
    }

    // Common variations
    const variations = {
      'energy': ['energy', 'calories'],
      'fibre': ['fibre', 'fiber'],
      'fiber': ['fibre', 'fiber'],
      'total carbs': ['total carbs', 'carbohydrates', 'carbs'],
      'carbohydrates': ['total carbs', 'carbohydrates', 'carbs'],
      'monounsaturated': ['monounsaturated', 'mufa'],
      'polyunsaturated': ['polyunsaturated', 'pufa'],
      'saturated': ['saturated', 'sfa'],
    };

    for (const [key, vals] of Object.entries(variations)) {
      if (vals.includes(label1) && vals.includes(label2)) {
        return true;
      }
    }

    return false;
  }

  // Check if units match
  function unitsMatch(unit1, unit2) {
    const u1 = unit1.toLowerCase().trim();
    const u2 = unit2.toLowerCase().trim();

    if (u1 === u2) {
      return true;
    }

    // Common unit variations
    const unitMap = {
      'µg': ['µg', 'μg', 'ug', 'mcg'],
      'mg': ['mg'],
      'g': ['g'],
      'kcal': ['kcal', 'cal'],
      'kj': ['kj'],
      'iu': ['iu'],
    };

    for (const [key, vals] of Object.entries(unitMap)) {
      if (vals.includes(u1) && vals.includes(u2)) {
        return true;
      }
    }

    return false;
  }

  // Helper: Sleep for ms milliseconds
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: #44d07b;
      color: #262a3b;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Initialize
  if (isCustomFoodsPage()) {
    console.log('On custom foods page - paste handler ready');
    setupPasteHandler();
  }

})();
