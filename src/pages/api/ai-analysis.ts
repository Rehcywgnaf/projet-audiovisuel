import type { NextApiRequest, NextApiResponse } from 'next';
import AIServiceManager from '@/lib/AIServiceManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Log de débogage pour comprendre la requête entrante
  console.log('Requête AI reçue:', {
    method: req.method,
    body: req.body,
    query: req.query
  });

  // Vérifier que la requête est POST
  if (req.method !== 'POST') {
    console.error('Méthode non autorisée:', req.method);
    return res.status(405).json({ 
      error: 'Méthode non autorisée',
      details: `Méthode reçue: ${req.method}, Méthode attendue: POST`
    });
  }

  try {
    // Validation des paramètres d'entrée
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Corps de requête vide');
      return res.status(400).json({ 
        error: 'Requête invalide', 
        details: 'Corps de requête vide' 
      });
    }

    // Récupérer l'instance du service AI
    const aiServiceManager = AIServiceManager.getInstance();

    // Log des paramètres avant génération
    console.log('Paramètres AI:', req.body);

    // Générer le contenu en utilisant les paramètres de la requête
    const response = await aiServiceManager.generateContent(req.body);

    // Log de la réponse générée
    console.log('Réponse AI générée:', response);

    // Renvoyer la réponse
    res.status(200).json(response);
  } catch (error) {
    // Log détaillé de l'erreur
    console.error('Erreur lors de l\'analyse AI:', {
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : 'Pas de stack trace',
      body: req.body
    });

    // Gestion des différents types d'erreurs
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Erreur lors de l\'analyse AI', 
        details: error.message,
        stack: error.stack
      });
    }

    res.status(500).json({ 
      error: 'Erreur inconnue lors de l\'analyse AI',
      details: String(error)
    });
  }
}