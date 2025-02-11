export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeText(text: string): string {
  // Supprimer les espaces en début et fin
  text = text.trim();
  
  // Supprimer les caractères spéciaux ou encodages HTML
  text = text.replace(/&[a-z]+;/gi, '')  // Enlève les entités HTML
             .replace(/(<([^>]+)>)/gi, '')  // Enlève les balises HTML
             .replace(/[\n\r\t]/g, ' ')  // Remplace les sauts de ligne par des espaces
             .replace(/\s+/g, ' ');  // Réduit les espaces multiples à un seul

  return text;
}