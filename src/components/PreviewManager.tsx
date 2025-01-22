import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Maximize2, FileText, History, Settings } from 'lucide-react';

const PreviewManager = ({ document, version, onVersionChange, versionManager }) => {
  const [activeFormat, setActiveFormat] = useState('web');
  const [scale, setScale] = useState(1);
  
  const formatOptions = [
    { id: 'web', label: 'Web View', icon: <Maximize2 className="w-4 h-4" /> },
    { id: 'print', label: 'Print View', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Preview</CardTitle>
            <div className="flex items-center gap-2">
              {formatOptions.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setActiveFormat(format.id)}
                  className={`p-2 rounded-lg flex items-center gap-1 ${
                    activeFormat === format.id 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {format.icon}
                  <span className="text-sm">{format.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 relative flex-1">
          <div className="absolute inset-0 overflow-auto bg-gray-50">
            <div 
              className="min-h-full p-8 bg-white shadow-lg mx-auto transition-transform"
              style={{
                width: activeFormat === 'print' ? '210mm' : '100%',
                transform: `scale(${scale})`,
                transformOrigin: 'top center'
              }}
            >
              {/* Zone de rendu du document */}
              <div className="prose max-w-none">
                {document && document.content}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles de version et zoom */}
      <div className="mt-4 flex justify-between items-center p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-500" />
          <select 
            className="text-sm bg-white border rounded px-2 py-1"
            value={version}
            onChange={(e) => onVersionChange(e.target.value)}
          >
            <option value="latest">Version actuelle</option>
            <option value="previous">Version précédente</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.max(0.25, s - 0.25))}
            className="p-1 hover:bg-gray-200 rounded"
          >
            -
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(s => Math.min(2, s + 0.25))}
            className="p-1 hover:bg-gray-200 rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewManager;