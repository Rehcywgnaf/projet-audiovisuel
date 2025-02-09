import type { NextApiRequest, NextApiResponse } from 'next';
import AIServiceManager from '@/lib/AIServiceManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Vérifier que la requête est POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Récupérer l'instance du service AI
    const aiServiceManager = AIServiceManager.getInstance();

    // Générer le contenu en utilisant les paramètres de la requête
    const response = await aiServiceManager.generateContent(req.body);

    // Renvoyer la réponse
    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur lors de l\'analyse AI:', error);

    // Gestion des différents types d'erreurs
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Erreur lors de l\'analyse AI', 
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Erreur inconnue lors de l\'analyse AI' 
    });
  }
}