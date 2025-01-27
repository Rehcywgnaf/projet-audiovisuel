import React, { useState } from 'react';
import { File, FileText, Save, Download, Upload } from 'lucide-react';
import { documentTemplates } from './DocumentTemplates';

const DocumentGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [documentContent, setDocumentContent] = useState({});

  const handleTemplateSelect = (category, template) => {
    setSelectedCategory(category);
    setSelectedTemplate(template);
    // Initialiser le contenu avec les sections vides
    const initialContent = {};
    documentTemplates[category][template].sections.forEach(section => {
      if (section.fields) {
        initialContent[section.title] = section.fields.reduce((acc, field) => ({
          ...acc,
          [field]: ''
        }), {});
      } else if (section.items) {
        initialContent[section.title] = section.items.reduce((acc, item) => ({
          ...acc,
          [item]: 0
        }), {});
      } else {
        initialContent[section.title] = '';
      }
    });
    setDocumentContent(initialContent);
  };

  const handleContentChange = (section, field, value) => {
    setDocumentContent(prev => ({
      ...prev,
      [section]: field ? {
        ...prev[section],
        [field]: value
      } : value
    }));
  };

  const generateDocument = async () => {
    // TODO: Intégration avec Google Drive
    console.log('Generating document:', {
      category: selectedCategory,
      template: selectedTemplate,
      content: documentContent
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Générateur de Documents
          </h2>

          {/* Sélection du template */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(documentTemplates).map(([category, templates]) => (
              <div key={category}>
                <h3 className="font-medium mb-2 capitalize">{category}</h3>
                <div className="space-y-2">
                  {Object.entries(templates).map(([name, template]) => (
                    <button
                      key={name}
                      onClick={() => handleTemplateSelect(category, name)}
                      className={`w-full p-3 rounded-lg border text-left text-sm hover:bg-blue-50 transition
                        ${selectedTemplate === name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start">
                        <File className="h-4 w-4 mt-1 mr-2" />
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-xs text-gray-500">
                            Format: {template.format}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Éditeur de document */}
          {selectedTemplate && (
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">{selectedTemplate}</h3>
              
              <div className="space-y-6">
                {documentTemplates[selectedCategory][selectedTemplate].sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="font-medium">{section.title}</h4>
                    
                    {section.fields ? (
                      // Champs pour les informations structurées
                      <div className="grid grid-cols-2 gap-4">
                        {section.fields.map(field => (
                          <div key={field}>
                            <label className="block text-sm text-gray-600 mb-1">
                              {field}
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded"
                              value={documentContent[section.title]?.[field] || ''}
                              onChange={(e) => handleContentChange(
                                section.title,
                                field,
                                e.target.value
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    ) : section.items ? (
                      // Champs pour les budgets
                      <div className="space-y-2">
                        {section.items.map(item => (
                          <div key={item} className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">{item}</label>
                            <input
                              type="number"
                              className="w-32 p-2 border rounded"
                              value={documentContent[section.title]?.[item] || ''}
                              onChange={(e) => handleContentChange(
                                section.title,
                                item,
                                e.target.value
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Champ texte libre pour les sections narratives
                      <textarea
                        className="w-full h-32 p-3 border rounded"
                        placeholder={section.placeholder}
                        value={documentContent[section.title] || ''}
                        onChange={(e) => handleContentChange(
                          section.title,
                          null,
                          e.target.value
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={generateDocument}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer sur Drive
                </button>
                <button
                  onClick={() => {/* TODO: Export local */}}
                  className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </button>
                <button
                  onClick={() => {/* TODO: Import */}}
                  className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
