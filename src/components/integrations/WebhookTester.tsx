import React from 'react';
import { Play, Check, X } from 'lucide-react';
import { generateSignature } from '../../utils/security/webhookSecurity';

interface WebhookTesterProps {
  url: string;
  secret: string;
  onTest: (result: boolean) => void;
}

export default function WebhookTester({ url, secret, onTest }: WebhookTesterProps) {
  const [testing, setTesting] = React.useState(false);
  const [result, setResult] = React.useState<{
    success: boolean;
    message?: string;
  } | null>(null);

  const testWebhook = async () => {
    setTesting(true);
    try {
      // Créer un payload de test
      const payload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'Test webhook'
        }
      };

      // Générer la signature
      const signature = await generateSignature(JSON.stringify(payload), secret);

      // Envoyer la requête de test
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature
        },
        body: JSON.stringify(payload)
      });

      const success = response.ok;
      setResult({
        success,
        message: success ? 'Test réussi' : 'Échec du test'
      });
      onTest(success);
    } catch (error) {
      setResult({
        success: false,
        message: error.message
      });
      onTest(false);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={testWebhook}
        disabled={testing || !url || !secret}
        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
          testing
            ? 'bg-gray-400 cursor-not-allowed'
            : result?.success
            ? 'bg-green-600 hover:bg-green-700'
            : result?.success === false
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {testing ? (
          <Play className="animate-spin h-4 w-4 mr-2" />
        ) : result?.success ? (
          <Check className="h-4 w-4 mr-2" />
        ) : result?.success === false ? (
          <X className="h-4 w-4 mr-2" />
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )}
        {testing ? 'Test en cours...' : 'Tester le webhook'}
      </button>

      {result && (
        <p className={`mt-2 text-sm ${
          result.success ? 'text-green-600' : 'text-red-600'
        }`}>
          {result.message}
        </p>
      )}
    </div>
  );
}