import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Brain, AlertCircle, ThumbsUp } from 'lucide-react';

interface Props {
  content?: string;
  onChange?: (content: string) => void;
}

const AIEnhancedEditor: React.FC<Props> = ({ content = '', onChange }) => {
  const [editorContent, setEditorContent] = useState(content);
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const demoSuggestions = [
    {
      type: 'requirement',
      content: 'Suggestion : Mentionner l\'innovation technologique',
      importance: 'high'
    },
    {
      type: 'reference',
      content: 'Référence suggérée : Projet "Océans Vivants 2024"',
      importance: 'medium'
    },
    {
      type: 'expertise',
      content: 'Suggestion : Mettre en avant l\'expertise en captation 4K',
      importance: 'medium'
    }
  ];

  useEffect(() => {
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      setSuggestions(demoSuggestions);
      setIsAnalyzing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [editorContent]);

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange?.(newContent);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Section du document</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <textarea
              className="w-full h-48 p-3 border rounded-lg resize-none"
              value={editorContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Commencez à rédiger..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Brain className="w-4 h-4" />
              Assistant IA actif
            </div>
          </CardContent>
        </Card>

        {suggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className={`border-l-4 ${suggestion.importance === 'high' ? 'border-l-yellow-500' : 'border-l-blue-500'}`}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {suggestion.importance === 'high' ? (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <ThumbsUp className="w-4 h-4 text-blue-500" />
                  )}
                  <p className="text-sm">{suggestion.content}</p>
                </div>
                <button 
                  className="px-2 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                  onClick={() => {
                    const updatedContent = `${editorContent}\n${suggestion.content}`;
                    handleContentChange(updatedContent);
                  }}
                >
                  Appliquer
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {suggestions.length === 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center text-sm text-gray-500">
                {isAnalyzing ? 'Analyse en cours...' : 'Commencez à rédiger pour obtenir des suggestions'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIEnhancedEditor;