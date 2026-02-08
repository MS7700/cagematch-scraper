function splitWithParenthesisHandling(input) {
    const result = [];
    let current = "";
    let insideParentheses = 0;
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (char === '(') {
        insideParentheses++;
        current += char;
      } else if (char === ')') {
        insideParentheses--;
        current += char;
      } else if ((char === ',' || char === '&') && insideParentheses === 0) {
        // We found a separator outside parentheses
        if (current.trim()) {
          result.push(current.trim());
        }
        current = "";
      } else {
        current += char;
      }
    }
    
    // Add the last part if it's not empty
    if (current.trim()) {
      result.push(current.trim());
    }
    
    return result;
  }

  function cleanMatchesText(text) {
    if (!text) return "";
    return text.replaceAll(" (c)", "")
        .replaceAll(/\(\d{1,}:\d{1,}\)/g, "")
        .replaceAll(/\s-\s.*$/g, "")
        .replaceAll(/\sby\s.*$/g, "")
        .replaceAll(/\s*\[\d{1,}:\d{1,}\]\s*/g, "")
        .replaceAll(/\s*\[[^\]]*?\]/g, "")
        .trim();
}

function splitBySeparatorRaw(text, separator) {
    const parts = [];
    let current = "";
    let depth = 0;
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') depth++;
        else if (text[i] === ')') depth--;
        
        if (depth === 0 && text.startsWith(separator, i)) {
            parts.push(current);
            current = "";
            i += separator.length - 1; 
        } else {
            current += text[i];
        }
    }
    parts.push(current);
    return parts;
}

function extractLastBalancedGroup(text) {
    const trimmed = text.trim();
    if (!trimmed.endsWith(')')) return null;

    let depth = 0;
    for (let i = trimmed.length - 1; i >= 0; i--) {
        if (trimmed[i] === ')') depth++;
        else if (trimmed[i] === '(') depth--;

        if (depth === 0) {
            return {
                head: trimmed.substring(0, i).trim(),
                tail: trimmed.substring(i + 1, trimmed.length - 1)
            };
        }
    }
    return null;
}


  module.exports = {splitWithParenthesisHandling, cleanMatchesText, splitBySeparatorRaw, extractLastBalancedGroup};