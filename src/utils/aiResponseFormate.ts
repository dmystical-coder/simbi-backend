/**
 * Enhanced function to format AI responses with better readability
 * Handles special formatting for study plans and similar structured content
 * 
 * @param aiResponse - The raw AI response text with escape characters
 * @returns Properly formatted human-readable text with improved structure
 */
export function enhancedFormatAIResponse(aiResponse: string): string {
  if (!aiResponse) {
    return '';
  }

  // Step 1: Replace escape sequences with actual characters
  let formattedText = aiResponse
    .replace(/\\n/g, '\n')         // Convert \n to actual line breaks
    .replace(/\\t/g, '\t')         // Convert \t to actual tabs
    .replace(/\\"/g, '"')          // Convert \" to actual quotes
    .replace(/\\'/g, "'")          // Convert \' to actual single quotes
    .replace(/\\\\/g, '\\');       // Convert \\ to actual backslash

  // Step 2: Improve header formatting - add space before and after headers
  formattedText = formattedText
    .replace(/([^\n])((\n|\n\n)\*\*)/g, '$1\n\n**') // Ensure empty line before headers
    .replace(/\*\*([^*]+)\*\*(\n)([^\n])/g, '**$1**\n\n$3'); // Ensure empty line after headers

  // Step 3: Format steps and sections for better readability
  formattedText = formattedText
    // Enhance step formatting (e.g., "Step 1: Review")
    .replace(/\*\*(Step \d+:[^*]+)\*\*/g, '## **$1**')
    // Format additional sections (like "Additional Tips:")
    .replace(/\*\*(Additional Tips:)\*\*/g, '## **$1**')
    // Ensure proper list formatting
    .replace(/\n\* /g, '\n• '); // Replace asterisk with bullet point for better visibility

  // Step 4: Clean up excessive line breaks while ensuring proper spacing
  formattedText = formattedText
    .replace(/\n{3,}/g, '\n\n')  // Replace 3+ consecutive line breaks with double line break
    .replace(/\n\n## /g, '\n\n## '); // Ensure proper spacing before section headers

  // Step 5: Add proper indentation for readability within sections
  formattedText = formattedText
    .replace(/(## \*\*[^*]+\*\*\n\n)([^\n#]+)/g, '$1    $2'); // Indent paragraphs under headers

  // Final touchup - ensure proper spacing before conclusion paragraph
  formattedText = formattedText
    .replace(/(\n\n)(Remember,|That's it|In conclusion)/g, '\n\n\n$2');

  return formattedText;
}


export function removeSpecials(str:string) {
    var lower = str.toLowerCase();
    var upper = str.toUpperCase();

    var res = "";
    for(var i=0; i<lower.length; ++i) {
        if(lower[i] != upper[i] || lower[i].trim() === '')
            res += str[i];
    }
    return res;
}