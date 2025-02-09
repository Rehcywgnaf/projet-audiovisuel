export function validateURL(url) {
  try {
    new URL(url);
    return /^https?:\/\//i.test(url);
  } catch {
    return false;
  }
}

export function sanitizeText(text) {
  if (!text) return '';
  
  // Supprime le HTML, les scripts, normalise les espaces
  return text
    .replace(/<[^>]*>/g, '')  // Supprime les balises HTML
    .replace(/&[a-z]+;/gi, '') // Supprime les entités HTML
    .replace(/\s+/g, ' ')      // Normalise les espaces
    .trim();
}

export function extractDate(text) {
  const dateFormats = [
    /(\d{1,2}[-/]\d{1,2}[-/]\d{4})/,   // JJ/MM/AAAA ou JJ-MM-AAAA
    /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/,   // AAAA/MM/JJ
    /(\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4})/i
  ];

  for (const regex of dateFormats) {
    const match = text.match(regex);
    if (match) return match[1];
  }

  return null;
}

export function extractBudget(text) {
  const budgetRegex = /(\d+(?:\s*\d{3})*)\s*(?:€|euros)/i;
  const match = text.match(budgetRegex);
  return match ? `${match[1]} €` : null;
}
