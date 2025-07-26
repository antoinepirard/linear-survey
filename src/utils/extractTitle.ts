/**
 * Utility functions for extracting document titles from HTML content
 */

/**
 * Extracts the text content from the first H1 element in HTML
 * @param htmlContent - The HTML content to parse
 * @returns The extracted title or null if no H1 found
 */
export function extractTitleFromH1(htmlContent: string): string | null {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return null;
  }

  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return null;
  }

  // Create a temporary DOM element to parse HTML safely
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Find the first H1 element
  const h1Element = tempDiv.querySelector('h1');
  
  if (!h1Element) {
    return null;
  }

  // Extract text content and clean it up
  let titleText = h1Element.textContent || '';
  
  // Remove extra whitespace and normalize
  titleText = titleText.trim().replace(/\s+/g, ' ');
  
  // Return null if the H1 is empty after cleaning
  if (!titleText) {
    return null;
  }

  // Truncate to 100 characters to match document title validation
  if (titleText.length > 100) {
    titleText = titleText.substring(0, 97) + '...';
  }

  return titleText;
}

/**
 * Checks if a document title appears to be auto-generated/default
 * @param title - The title to check
 * @returns True if the title appears to be a default one
 */
export function isDefaultTitle(title: string): boolean {
  const defaultTitles = [
    'Untitled',
    'Untitled Document',
    'New Document',
    'Document',
  ];
  
  const normalizedTitle = title.trim();
  
  // Check exact matches
  if (defaultTitles.includes(normalizedTitle)) {
    return true;
  }
  
  // Check patterns like "Untitled 1", "New Document 2", etc.
  const patterns = [
    /^Untitled\s*\d*$/,
    /^Untitled Document\s*\d*$/,
    /^New Document\s*\d*$/,
    /^Document\s*\d*$/,
  ];
  
  return patterns.some(pattern => pattern.test(normalizedTitle));
}

/**
 * Checks if an extracted title would conflict with existing document titles
 * @param extractedTitle - The title extracted from H1
 * @param existingTitles - Array of existing document titles
 * @returns A unique title that doesn't conflict
 */
export function ensureUniqueTitle(extractedTitle: string, existingTitles: string[]): string {
  let candidateTitle = extractedTitle;
  let counter = 1;
  
  while (existingTitles.includes(candidateTitle)) {
    // If the original title was already truncated, we need to account for the suffix
    const maxBaseLength = extractedTitle.endsWith('...') ? 94 : 97;
    let baseTitle = extractedTitle;
    
    if (extractedTitle.endsWith('...')) {
      baseTitle = extractedTitle.substring(0, extractedTitle.length - 3);
    }
    
    const suffix = ` ${counter}`;
    
    if (baseTitle.length + suffix.length > maxBaseLength) {
      candidateTitle = baseTitle.substring(0, maxBaseLength - suffix.length) + suffix;
    } else {
      candidateTitle = baseTitle + suffix;
    }
    
    counter++;
    
    // Prevent infinite loops
    if (counter > 100) {
      candidateTitle = `${baseTitle.substring(0, 85)} ${Date.now()}`;
      break;
    }
  }
  
  return candidateTitle;
}