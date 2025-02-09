import type { NextApiRequest, NextApiResponse } from 'next';

// Configuration par défaut pour les différentes versions de l'API
const API_VERSIONS = {
  STABLE: '2023-06-01',
  BETA: '2024-01-01'
};

// Configuration minimale requise pour un appel API
const MINIMAL_REQUEST = {
  model: 'claude-3-sonnet',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'Test' }]
};

// Configuration des headers communs
const getBaseHeaders = (apiKey: string, version: string) => ({
  'Content-Type': 'application/json',
  'x-api-key': apiKey.trim(),
  'anthropic-version': version
});

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

    // Log de la configuration initiale
    console.log('Initial request configuration:', {
      headers: {
        ...req.headers,
        'x-api-key': '[REDACTED]',
        'anthropic-api-key': '[REDACTED]'
      },
      body: JSON.stringify(req.body, null, 2)
    });

    // Construction du corps de la requête avec les paramètres requis
    const requestBody = {
      model: 'claude-3-sonnet',
      max_tokens: 1000,
      messages: req.body.messages,
      system: 'Tu es Claude, un assistant créé par Anthropic. Tu communiques toujours en français.'
    };

    // Log de la configuration finale
    console.log('Final request configuration:', {
      api_version: API_VERSIONS.STABLE,
      endpoint: '/v1/messages',
      request_params: {
        ...requestBody,
        messages: requestBody.messages.map(m => ({
          role: m.role,
          content_length: m.content.length
        }))
      }
    });

    // Proxy de la requête vers l'API Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: getBaseHeaders(apiKey, API_VERSIONS.STABLE),
      body: JSON.stringify(requestBody)
    });

    // Gestion des erreurs de réponse
    if (!response.ok) {
      const errorBody = await response.text();
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorBody,
        api_version: API_VERSIONS.STABLE,
        request_params: {
          ...requestBody,
          messages: requestBody.messages.map(m => ({
            role: m.role,
            content_length: m.content.length
          }))
        }
      };

      console.error('Claude API error response:', errorDetails);

      // Si l'erreur est liée à la version de l'API, on réessaie avec la version bêta
      if (errorBody.includes('version')) {
        console.log('Retrying with beta API version...');
        const betaResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: getBaseHeaders(apiKey, API_VERSIONS.BETA),
          body: JSON.stringify(requestBody)
        });

        if (betaResponse.ok) {
          const data = await betaResponse.json();
          console.log('Successful response with beta API version');
          return res.status(200).json(data);
        }

        // Log de l'erreur avec la version bêta
        const betaErrorBody = await betaResponse.text();
        errorDetails.beta_error = {
          status: betaResponse.status,
          body: betaErrorBody
        };
      }

      return res.status(response.status).json({ 
        error: 'Failed to fetch from Claude API', 
        details: errorBody,
        debug_info: errorDetails
      });
    }

    // Récupération et transmission de la réponse
    const data = await response.json();
    console.log('Successful response:', {
      status: response.status,
      response_length: JSON.stringify(data).length
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