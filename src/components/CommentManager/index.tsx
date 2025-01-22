import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageCircle, Users, Clock, CheckCircle2, Tag, Brain } from 'lucide-react';

const CommentManager = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "Mise à jour nécessaire de la section budget",
      user: "Marie Martin",
      timestamp: "2024-01-06T10:30:00",
      version: "v1.2",
      category: "budget",
      aiSuggestionRef: "sugg_123",
      resolved: false,
      replies: [
        {
          id: 11,
          text: "Modifications effectuées selon les nouveaux critères",
          user: "Jean Dupont",
          timestamp: "2024-01-06T11:45:00"
        }
      ]
    }
  ]);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://votre-serveur-websocket.com');

    ws.onopen = () => {
      console.log('WebSocket connecté');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const newComment = JSON.parse(event.data);
      setComments(prevComments => [...prevComments, newComment]);
    };

    ws.onclose = () => {
      console.log('WebSocket déconnecté');
      setConnected(false);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendComment = (comment) => {
    if (socket && connected) {
      socket.send(JSON.stringify(comment));
    }
  };

  const filteredComments = selectedCategory
    ? comments.filter(comment => comment.category === selectedCategory)
    : comments;

  const categories = [...new Set(comments.map(comment => comment.category))];

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Gestionnaire de Commentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(
                  category === selectedCategory ? null : category
                )}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  category === selectedCategory
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <Tag className="w-3 h-3" />
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredComments.map(comment => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{comment.user}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {comment.category}
                  </span>
                  <span className="flex items-center gap-1">
                    Version: {comment.version}
                  </span>
                  <span className={`flex items-center gap-1 ${
                    comment.resolved ? 'text-green-500' : 'text-orange-500'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {comment.resolved ? 'Résolu' : 'En attente'}
                  </span>
                  {comment.aiSuggestionRef && (
                    <button 
                      onClick={() => window.postMessage({
                        type: 'OPEN_AI_SUGGESTION',
                        suggestionId: comment.aiSuggestionRef
                      })}
                      className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Brain className="w-3 h-3" />
                      Voir suggestion IA
                    </button>
                  )}
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 space-y-2 border-l-2 pl-4">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span className="font-medium text-sm">{reply.user}</span>
                        </div>
                        <p className="text-sm">{reply.text}</p>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(reply.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentManager;