import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const sections = [
  { id: 'company', type: 'text', label: 'Société', placeholder: 'Nom de votre société' },
  { id: 'technical', type: 'textarea', label: 'Proposition Technique', placeholder: 'Détails techniques' },
  { id: 'financial', type: 'textarea', label: 'Proposition Financière', placeholder: 'Budget détaillé' },
  { id: 'references', type: 'textarea', label: 'Références', placeholder: 'Références similaires' },
  { id: 'planning', type: 'textarea', label: 'Planning', placeholder: 'Planning détaillé' }
];

export default function TemplateAO() {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);

  function validate() {
    const newErrors = [];
    for (const section of sections) {
      if (!data[section.id]) {
        newErrors.push(`${section.label} requis`);
      }
    }
    return newErrors;
  }

  function handleSubmit() {
    const newErrors = validate();
    setErrors(newErrors);
    if (newErrors.length === 0) {
      console.log(data);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">Appel d'Offres</h2>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc pl-4">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {sections.map((section, i) => (
          <div key={i} className="border p-4 rounded-lg">
            <label className="block mb-2">
              {section.label}<span className="text-red-500">*</span>
            </label>
            
            {section.type === 'text' ? (
              <input
                type="text"
                value={data[section.id] || ''}
                onChange={e => setData({...data, [section.id]: e.target.value})}
                placeholder={section.placeholder}
                className="w-full p-2 border rounded"
              />
            ) : (
              <textarea
                value={data[section.id] || ''}
                onChange={e => setData({...data, [section.id]: e.target.value})}
                placeholder={section.placeholder}
                className="w-full p-2 border rounded min-h-[100px]"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end gap-4">
          <button
            onClick={() => {setData({}); setErrors([]);}}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sauvegarder
          </button>
        </div>
      </CardContent>
    </Card>
  );
}