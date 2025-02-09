import type { NextApiRequest, NextApiResponse } from 'next';
import { AIServiceManager } from '../../lib/AIServiceManager';

const aiServiceManager = new AIServiceManager();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { messages, model, maxTokens } = req.body;

      const response = await aiServiceManager.generateContent({
        messages,
        model,
        maxTokens
      });

      res.status(200).json(response);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ 
        error: 'Failed to process request',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}