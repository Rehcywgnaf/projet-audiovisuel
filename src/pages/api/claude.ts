import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-api-key, anthropic-version');
    return res.status(200).end();
  }

  // Vérification de la méthode
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Validation de la clé API - d'abord des headers, puis de l'environnement
    let apiKey = req.headers['anthropic-api-key'] as string || 
                 req.headers['x-api-key'] as string || 
                 process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      console.error('CRITICAL: No API key found in request headers or environment');
      return res.status(401).json({ 
        error: 'API key not configured', 
        details: 'No API key found in request headers or environment variables' 
      });
    }

    // Si la clé est un tableau, prendre la première valeur
    if (Array.isArray(apiKey)) {
      apiKey = apiKey[0];
    }

    // Log des en-têtes pour débogage (en masquant la clé API)
    console.log('Request Headers:', {
      ...req.headers,
      'x-api-key': '[REDACTED]',
      'anthropic-api-key': '[REDACTED]'
    });

    // Log du corps de la requête pour débogage
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    // Configuration des en-têtes pour Anthropic
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2024-02-01'  // Version la plus récente de l'API
    };

    // Log des en-têtes qui seront envoyés à Anthropic (masqués)
    console.log('Sending to Anthropic with headers:', {
      ...headers,
      'x-api-key': '[REDACTED]'
    });

    // Modification pour utiliser le modèle Claude 3 Sonnet
    const requestBody = {
      ...req.body,
      model: 'claude-3-sonnet',
      system: 'Tu es Claude, un assistant créé par Anthropic. Tu communiques toujours en français.'
    };

    // Log du corps de la requête avant envoi
    console.log('Sending request body to Anthropic:', requestBody);

    // Proxy de la requête vers l'API Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    // Gestion des erreurs de réponse
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Claude API error response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorBody,
        requestHeaders: {
          ...headers,
          'x-api-key': '[REDACTED]'
        },
        requestBody
      });
      return res.status(response.status).json({ 
        error: 'Failed to fetch from Claude API', 
        details: errorBody,
        sentBody: requestBody
      });
    }

    // Récupération et transmission de la réponse
    const data = await response.json();
    console.log('Successful response from Anthropic:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: data
    });
    
    // Configuration des en-têtes CORS pour la réponse
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-api-key');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}