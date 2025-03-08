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

  module.exports = {splitWithParenthesisHandling};