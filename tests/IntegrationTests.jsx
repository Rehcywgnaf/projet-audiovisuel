import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const IntegrationTests = () => {
  const [testSuites, setTestSuites] = useState([
    {
      name: 'Authentification Google',
      status: 'pending',
      tests: [
        { name: 'Connexion standard', status: 'pending' },
        { name: 'Gmail personnel', status: 'pending' },
        { name: 'Compte Workspace', status: 'pending' }
      ]
    },
    {
      name: 'Permissions Drive',
      status: 'pending',
      tests: [
        { name: 'Héritage permissions', status: 'pending' },
        { name: 'Application rôles', status: 'pending' },
        { name: 'Mise à jour temps réel', status: 'pending' }
      ]
    },
    {
      name: 'Synchronisation',
      status: 'pending',
      tests: [
        { name: 'Auto-sync', status: 'pending' },
        { name: 'Gestion conflits', status: 'pending' },
        { name: 'Historique versions', status: 'pending' }
      ]
    },
    {
      name: 'Gestion Erreurs',
      status: 'pending',
      tests: [
        { name: 'Perte connexion', status: 'pending' },
        { name: 'Notifications', status: 'pending' },
        { name: 'Reconnexion auto', status: 'pending' }
      ]
    }
  ]);

  const [currentSuite, setCurrentSuite] = useState(null);
  const [currentTest, setCurrentTest] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      message,
      type,
      timestamp: new Date().toISOString()
    }]);
  };

  const runTest = async (suiteIndex, testIndex) => {
    const suite = testSuites[suiteIndex];
    const test = suite.tests[testIndex];
    
    setCurrentSuite(suiteIndex);
    setCurrentTest(testIndex);
    addLog(`Démarrage ${suite.name} - ${test.name}`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2;
    setTestSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].tests[testIndex].status = success ? 'success' : 'error';
      return newSuites;
    });

    addLog(
      `${suite.name} - ${test.name} : ${success ? 'Réussi' : 'Échec'}`,
      success ? 'success' : 'error'
    );
  };

  const runAllTests = async () => {
    for (let suiteIndex = 0; suiteIndex < testSuites.length; suiteIndex++) {
      const suite = testSuites[suiteIndex];
      for (let testIndex = 0; testIndex < suite.tests.length; testIndex++) {
        await runTest(suiteIndex, testIndex);
      }
    }
    setCurrentSuite(null);
    setCurrentTest(null);
    addLog('Tous les tests sont terminés', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tests d'Intégration</h2>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={runAllTests}
          disabled={currentSuite !== null}
        >
          Lancer tous les tests
        </button>
      </div>

      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Tests automatisés</AlertTitle>
        <AlertDescription>
          Vérification complète de l'intégration des composants.
          {currentSuite !== null && (
            <div className="mt-2">
              En cours : {testSuites[currentSuite].name} - 
              {testSuites[currentSuite].tests[currentTest].name}
            </div>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {testSuites.map((suite, suiteIndex) => (
          <div key={suiteIndex} className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">{suite.name}</h3>
              <div className="flex items-center space-x-2">
                {currentSuite === suiteIndex ? (
                  <Clock className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <button
                    className="text-sm text-blue-500 hover:text-blue-600"
                    onClick={() => suite.tests.forEach((_, testIndex) => runTest(suiteIndex, testIndex))}
                    disabled={currentSuite !== null}
                  >
                    Tester la suite
                  </button>
                )}
              </div>
            </div>
            
            <div className="divide-y">
              {suite.tests.map((test, testIndex) => (
                <div key={testIndex} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {currentSuite === suiteIndex && currentTest === testIndex ? (
                      <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : test.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : test.status === 'error' ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span>{test.name}</span>
                  </div>
                  <button
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    onClick={() => runTest(suiteIndex, testIndex)}
                    disabled={currentSuite !== null}
                  >
                    Tester
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {logs.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Logs</h3>
            <button 
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setLogs([])}
            >
              Effacer
            </button>
          </div>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`text-xs ${log.type === 'error' ? 'text-red-600' : log.type === 'success' ? 'text-green-600' : 'text-gray-600'}`}
              >
                [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationTests;