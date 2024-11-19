import React from 'react';
import { Play, Check, X } from 'lucide-react';
import { aiApi } from '../utils/api/routes';
import toast from 'react-hot-toast';

interface ApiKeyTesterProps {
  providerId: string;
  onTest: (success: boolean) => void;
}

export default function ApiKeyTester({ providerId, onTest }: ApiKeyTesterProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const handleTest = async () => {
    try {
      setIsLoading(true);
      setTestResult(null);

      const result = await aiApi.testKey(providerId);
      
      setTestResult({ success: true });
      await onTest(true);
      toast.success('Clé API validée avec succès');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      setTestResult({ 
        success: false, 
        error: errorMessage
      });
      await onTest(false);
      toast.error(`Erreur de validation : ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleTest}
        disabled={isLoading}
        className={`button-primary ${
          testResult?.success ? 'bg-green-600' : 
          testResult?.success === false ? 'bg-red-600' : ''
        }`}
      >
        {isLoading ? (
          <Play className="h-4 w-4 mr-2 animate-spin" />
        ) : testResult?.success ? (
          <Check className="h-4 w-4 mr-2" />
        ) : testResult?.success === false ? (
          <X className="h-4 w-4 mr-2" />
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )}
        {isLoading ? 'Test en cours...' : 'Tester la clé'}
      </button>

      {testResult?.error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {testResult.error}
        </p>
      )}
    </div>
  );
}