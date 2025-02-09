import { NextResponse } from 'next/server';
import AIServiceManager, { AIInteractionType } from '@/lib/AIServiceManager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, messages, maxTokens, temperature, performanceMetrics } = body;

    const aiManager = AIServiceManager.getInstance();
    const response = await aiManager.generateContent({
      type: type as AIInteractionType,
      messages,
      maxTokens,
      temperature,
      performanceMetrics
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}