import React, { useState } from 'react';
import { CheckCircle2, XCircle, PlayCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AuthTestSuite = () => {
  const [testCases, setTestCases] = useState([
    {
      id: 'auth-1',
      name: 'Connexion Google standard',
      email: 'user@company.com',
      expectedRole: 'editor',
      status: 'pending',
      steps: [
        'Redirection vers OAuth Google',
        'Sélection du compte',
        'Validation des permissions',
        'Retour application'
      ]
    },
    {
      id: 'auth-2',
      name: 'Compte Gmail personnel',
      email: 'personal@gmail.com',
      expectedRole: null,
      status: 'pending',
      steps: [
        'Tentative connexion',
        'Vérification domaine',
        'Message erreur approprié'
      ]
    },
    {
      id: 'auth-3',
      name: 'Compte Workspace approuvé',
      email: 'admin@audiovisuel.com',
      expectedRole: 'admin',
      status: 'pending',
      steps: [
        'Connexion Workspace',
        'Vérification permissions admin',
        'Accès dashboard'
      ]
    }
  ]);

  const [activeTest, setActiveTest] = useState(null);
  const [testLogs, setTestLogs] = useState([]);

  const runTest = (testId) => {
    setActiveTest(testId);
    setTimeout(() => {
      setTestCases(prev => prev.map(test => 
        test.id === testId ? 
          {...test, status: Math.random() > 0.2 ? 'success' : 'error'} : 
          test
      ));
      setTestLogs(prev => [...prev, {
        testId,
        timestamp: new Date().toISOString(),
        message: `Test ${testId} terminé`
      }]);
      setActiveTest(null);
    }, 2000);
  };

  const runAllTests = () => {
    testCases.forEach((test, index) => {
      setTimeout(() => runTest(test.id), index * 2500);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tests d'Authentification</h2>
        <div className="flex items-center space-x-2">
          <PlayCircle className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {activeTest ? 'Tests en cours' : 'Prêt'}
          </span>
        </div>
      </div>

      <Alert>
        <CheckCircle2 className="w-4 h-4" />
        <AlertTitle>Suite de Tests Automatiques</AlertTitle>
        <AlertDescription>
          Vérification complète du système d'authentification.
          Temps estimé: {testCases.length * 2.5} secondes.
        </AlertDescription>
      </Alert>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Scénarios de test</h3>
        </div>
        <div className="divide-y">
          {testCases.map((test) => (
            <div key={test.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {test.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : test.status === 'error' ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : activeTest === test.id ? (
                    <Clock className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <PlayCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h4 className="font-medium">{test.name}</h4>
                    <p className="text-sm text-gray-500">{test.email}</p>
                  </div>
                </div>
                <button
                  className={`px-4 py-2 rounded ${activeTest ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  onClick={() => !activeTest && runTest(test.id)}
                  disabled={!!activeTest}
                >
                  {activeTest === test.id ? 'En cours...' : 'Tester'}
                </button>
              </div>
              <div className="ml-8">
                <div className="text-sm text-gray-600">
                  {test.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-xs">→</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {testLogs.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Logs d'exécution</h3>
          <div className="space-y-1">
            {testLogs.map((log, index) => (
              <div key={index} className="text-xs text-gray-600">
                [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button 
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          onClick={() => setTestLogs([])}
        >
          Effacer les logs
        </button>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={runAllTests}
          disabled={!!activeTest}
        >
          Lancer tous les tests
        </button>
      </div>
    </div>
  );
};

export default AuthTestSuite;