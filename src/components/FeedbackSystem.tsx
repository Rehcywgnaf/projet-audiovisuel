import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bug, MessageCircle, Lightbulb, ThumbsUp } from 'lucide-react';

export default function FeedbackSystem() {
  const [feedbackType, setFeedbackType] = useState('bug');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement feedback submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Système de Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Type de feedback</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFeedbackType('bug')}
                className={`flex items-center gap-2 p-2 rounded ${
                  feedbackType === 'bug' ? 'bg-red-100 text-red-700' : 'bg-gray-50'
                }`}
              >
                <Bug className="w-4 h-4" />
                Bug
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('suggestion')}
                className={`flex items-center gap-2 p-2 rounded ${
                  feedbackType === 'suggestion' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Suggestion
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('other')}
                className={`flex items-center gap-2 p-2 rounded ${
                  feedbackType === 'other' ? 'bg-purple-100 text-purple-700' : 'bg-gray-50'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Autre
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded resize-none h-32"
              placeholder="Décrivez votre feedback..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Envoyer
          </button>

          {submitted && (
            <div className="flex items-center gap-2 p-2 bg-green-100 text-green-700 rounded">
              <ThumbsUp className="w-4 h-4" />
              Feedback envoyé avec succès !
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
