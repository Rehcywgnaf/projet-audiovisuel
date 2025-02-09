import type { NextApiRequest, NextApiResponse } from 'next';

// Configuration par défaut pour les différentes versions de l'API
const API_VERSIONS = {
  STABLE: '2024-01-31',
  BETA: '2024-02-01'
};

// Configuration des modèles Claude et leurs coûts
const MODELS = {
  complete: {
    name: 'claude-3-sonnet-20240229',
    cost_per_token: 0.00003
  },
  simple: {
    name: 'claude-3-haiku-20240307',
    cost_per_token: 0.00001
  }
};

// Configuration minimale requise pour un appel API
const MINIMAL_REQUEST = {
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'Test' }]
};

// Configuration des headers communs
const getBaseHeaders = (apiKey: string, version: string) => ({
  'Content-Type': 'application/json',
  'x-api-key': apiKey.trim(),
  'anthropic-version': version
});

// Calcul du coût basé sur le modèle et les tokens
const calculateCost = (modelType: 'simple' | 'complete', tokens: number): number => {
  return tokens * MODELS[modelType].cost_per_token;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-api-key, anthropic-version');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
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

    if (Array.isArray(apiKey)) {
      apiKey = apiKey[0];
    }

    console.log('Initial request configuration:', {
      headers: {
        ...req.headers,
        'x-api-key': '[REDACTED]',
        'anthropic-api-key': '[REDACTED]'
      },
      body: JSON.stringify(req.body, null, 2)
    });

    // Détermination du modèle basé sur la complexité
    const complexity = req.body.complexity || 'complete';
    const modelConfig = MODELS[complexity];

    // Construction du corps de la requête
    const requestBody = {
      model: modelConfig.name,
      max_tokens: req.body.max_tokens || MINIMAL_REQUEST.max_tokens,
      messages: req.body.messages,
      system: 'Tu es Claude, un assistant créé par Anthropic. Tu communiques toujours en français.'
    };

    console.log('Final request configuration:', {
      api_version: API_VERSIONS.STABLE,
      endpoint: '/v1/messages',
      model: modelConfig.name,
      request_params: {
        ...requestBody,
        messages: requestBody.messages.map(m => ({
          role: m.role,
          content_length: m.content.length
        }))
      }
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: getBaseHeaders(apiKey, API_VERSIONS.STABLE),
      body: JSON.stringify(requestBody)
    });

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

      if (errorBody.includes('version')) {
        console.log('Retrying with beta API version...');
        const betaResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: getBaseHeaders(apiKey, API_VERSIONS.BETA),
          body: JSON.stringify(requestBody)
        });

        if (betaResponse.ok) {
          const data = await betaResponse.json();
          const cost = calculateCost(complexity, data.usage?.total_tokens || 0);
          console.log('Successful response with beta API version');
          return res.status(200).json({ ...data, cost });
        }

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

    const data = await response.json();
    const cost = calculateCost(complexity, data.usage?.total_tokens || 0);

    console.log('Successful response:', {
      status: response.status,
      model: modelConfig.name,
      tokens: data.usage?.total_tokens,
      cost,
      response_length: JSON.stringify(data).length
    });
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-api-key');
    
    res.status(200).json({ ...data, cost });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}