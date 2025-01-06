import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Download, Upload, Eye, FileType } from 'lucide-react';

const ImportExportTab = ({ onPreview, onExport, onImport }) => {
  const [selectedFormat, setSelectedFormat] = useState('docx');
  const [importFile, setImportFile] = useState(null);
  
  const formats = [
    { id: 'docx', label: 'Word (.docx)', editable: true },
    { id: 'pdf', label: 'PDF', editable: false },
    { id: 'gdoc', label: 'Google Doc', editable: true },
    { id: 'html', label: 'Web Page', editable: false }
  ];

  return (
    <div className="space-y-6">
      {/* Section Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter le Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Format Selection */}
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors 
                    ${selectedFormat === format.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <FileType className="w-5 h-5 text-blue-500" />
                  <div className="text-left">
                    <div>{format.label}</div>
                    {format.editable && (
                      <div className="text-xs text-gray-500">Modifiable</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => onPreview(selectedFormat)}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Prévisualiser
              </button>
              <button
                onClick={() => onExport(selectedFormat)}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importer un Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Import Zone */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-upload').click()}
            >
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <div className="text-sm text-gray-600">
                Glissez un document ici ou cliquez pour sélectionner
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Formats supportés : DOCX, Google Doc
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImportFile(file);
                  if (file) onImport(file);
                }}
              />
            </div>

            {/* Import Status */}
            {importFile && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                <FileType className="w-4 h-4" />
                {importFile.name} importé avec succès
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExportTab;
