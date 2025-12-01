// Cronometer Keyboard Plugin
// Add keyboard navigation to custom foods page

(function() {
  'use strict';

  console.log('Cronometer Keyboard Plugin loaded');

  let isInitialized = false;

  // Check if we're on the custom foods page
  function isCustomFoodsPage() {
    return window.location.hash === '#custom-foods' ||
           window.location.href.includes('custom-foods');
  }

  // Convert all value divs to input fields
  function convertDivsToInputs() {
    if (!isCustomFoodsPage()) {
      return;
    }

    if (isInitialized) {
      return;
    }

    console.log('Converting value divs to input fields...');

    // Find all table rows in nutrition tables
    const rows = document.querySelectorAll('table.crono-table tr');
    let convertedCount = 0;

    rows.forEach(row => {
      // Skip header rows
      if (row.classList.contains('table-header')) {
        return;
      }

      const cells = row.querySelectorAll('td');

      // We're looking for rows with at least 3 cells (label, value, unit)
      if (cells.length >= 3) {
        const valueCell = cells[1]; // Second column contains the value

        // Check if this is a value cell (right-aligned)
        if (valueCell.getAttribute('align') === 'right') {
          const valueDiv = valueCell.querySelector('div.gwt-Label');

          if (valueDiv && !valueCell.querySelector('input')) {
            // Get the current value
            const currentValue = valueDiv.textContent.trim();

            // Skip if it's already an empty placeholder
            if (currentValue === '-') {
              // Create an input for empty fields
              const input = document.createElement('input');
              input.type = 'text';
              input.className = 'number-box';
              input.maxLength = 8;
              input.size = 8;
              input.placeholder = '-';

              // Replace the div with the input
              valueCell.innerHTML = '';
              valueCell.appendChild(input);
              convertedCount++;
            } else {
              // Create an input with the current value
              const input = document.createElement('input');
              input.type = 'text';
              input.className = 'number-box';
              input.maxLength = 8;
              input.size = 8;
              input.value = currentValue;

              // Replace the div with the input
              valueCell.innerHTML = '';
              valueCell.appendChild(input);
              convertedCount++;
            }
          }
        }
      }
    });

    if (convertedCount > 0) {
      console.log(`Converted ${convertedCount} fields to inputs`);
      isInitialized = true;

      // Now Tab key will work natively between inputs!
      // We just need to handle Enter key to move to next field
      addEnterKeyHandling();

      // Set up paste handler for auto-filling from Claude responses
      setupPasteHandler();
    } else {
      console.log('No fields found to convert, will retry...');
      setTimeout(convertDivsToInputs, 500);
    }
  }

  // Add Enter key handling to move to next field
  function addEnterKeyHandling() {
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' && event.target.matches('input.number-box')) {
        event.preventDefault();

        // Find all inputs
        const allInputs = Array.from(document.querySelectorAll('input.number-box'));
        const currentIndex = allInputs.indexOf(event.target);

        if (currentIndex !== -1 && currentIndex < allInputs.length - 1) {
          // Focus the next input
          const nextInput = allInputs[currentIndex + 1];
          nextInput.focus();
          nextInput.select();
        }
      }
    });

    console.log('Enter key handling added');
  }

  // Parse pasted text and auto-fill matching fields
  function setupPasteHandler() {
    document.addEventListener('paste', function(event) {
      // Only handle paste if we're on the custom foods page
      if (!isCustomFoodsPage()) {
        return;
      }

      // Get the pasted text
      const pastedText = event.clipboardData.getData('text');

      if (!pastedText) {
        return;
      }

      console.log('Paste detected, attempting to parse nutritional data...');

      // Parse and fill the fields
      const filledCount = parsePastedData(pastedText);

      if (filledCount > 0) {
        console.log(`Auto-filled ${filledCount} fields from pasted data`);

        // Show a brief notification
        showNotification(`✓ Auto-filled ${filledCount} fields`);
      }
    });

    console.log('Paste handler added');
  }

  // Parse the pasted text and fill matching fields
  function parsePastedData(text) {
    let filledCount = 0;

    // Split into lines
    const lines = text.split('\n');

    // Pattern to match: Label: Number Unit OR Label Number Unit (colon optional)
    // Examples: "Energy: 380 kcal", "Energy 380 kcal", "B1 (Thiamine) 0.08 mg"
    const pattern = /^[•\-\s]*(.+?)[\s:]+(\d+\.?\d*)\s+([a-zA-Zµμ]+)/;

    lines.forEach(line => {
      const match = line.trim().match(pattern);

      if (match) {
        const label = match[1].trim();
        const value = match[2];
        const unit = match[3];

        // Try to find and fill the matching field
        if (fillField(label, value, unit)) {
          filledCount++;
        }
      }
    });

    return filledCount;
  }

  // Find and fill a field matching the label
  function fillField(label, value, unit) {
    // Normalize the label for matching
    const normalizedLabel = normalizeLabel(label);

    // Find all table rows
    const rows = document.querySelectorAll('table.crono-table tr');

    for (const row of rows) {
      const cells = row.querySelectorAll('td');

      if (cells.length >= 3) {
        // Get the label cell (first column)
        const labelCell = cells[0];
        const labelDiv = labelCell.querySelector('div.gwt-HTML');

        if (labelDiv) {
          const fieldLabel = labelDiv.textContent.trim();
          const normalizedFieldLabel = normalizeLabel(fieldLabel);

          // Check if labels match
          if (labelsMatch(normalizedLabel, normalizedFieldLabel)) {
            // Check if unit matches (third column)
            const unitCell = cells[2];
            const unitDiv = unitCell.querySelector('div.gwt-Label');

            if (unitDiv) {
              const fieldUnit = unitDiv.textContent.trim();

              // Verify units match (with some flexibility)
              if (unitsMatch(unit, fieldUnit)) {
                // Fill the input (second column)
                const valueCell = cells[1];
                const input = valueCell.querySelector('input.number-box');

                if (input) {
                  input.value = value;
                  input.style.backgroundColor = '#d5f3df'; // Light green flash
                  setTimeout(() => {
                    input.style.backgroundColor = '';
                  }, 1000);

                  console.log(`Filled ${fieldLabel}: ${value} ${fieldUnit}`);
                  return true;
                }
              }
            }
          }
        }
      }
    }

    return false;
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
    // Exact match (case-insensitive, punctuation removed)
    if (label1 === label2) {
      return true;
    }

    // Check for common variations only - must be exact match to a known synonym
    const variations = {
      'energy': ['energy', 'calories'],
      'fibre': ['fibre', 'fiber'],
      'fiber': ['fibre', 'fiber'],
      'total carbs': ['total carbs', 'carbohydrates'],
      'carbohydrates': ['total carbs', 'carbohydrates'],
      'monounsaturated': ['monounsaturated', 'mufa'],
      'polyunsaturated': ['polyunsaturated', 'pufa'],
      'saturated': ['saturated', 'sfa'],
    };

    // Check if both labels are in the same variation group
    for (const [key, vals] of Object.entries(variations)) {
      if (vals.includes(label1) && vals.includes(label2)) {
        return true;
      }
    }

    return false;
  }

  // Check if units match
  function unitsMatch(unit1, unit2) {
    // Normalize units
    const u1 = unit1.toLowerCase().trim();
    const u2 = unit2.toLowerCase().trim();

    // Direct match
    if (u1 === u2) {
      return true;
    }

    // Handle common variations
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

  // Show a brief notification
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
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Watch for URL changes (single-page app navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      isInitialized = false;
      if (isCustomFoodsPage()) {
        setTimeout(convertDivsToInputs, 1000);
      }
    }
  }).observe(document, { subtree: true, childList: true });

  // Watch for hash changes
  window.addEventListener('hashchange', function() {
    isInitialized = false;
    if (isCustomFoodsPage()) {
      setTimeout(convertDivsToInputs, 1000);
    }
  });

  // Initialize immediately if we're already on the custom foods page
  if (isCustomFoodsPage()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(convertDivsToInputs, 1000);
      });
    } else {
      setTimeout(convertDivsToInputs, 1000);
    }
  }

})();
