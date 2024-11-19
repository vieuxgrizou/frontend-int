import React from 'react';
import { useTranslation } from './i18n/useTranslation';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Envoyer l'erreur à un service de monitoring
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold text-earth-900 mb-4">
          {t('errors.title')}
        </h2>
        <p className="text-earth-600 mb-4">
          {t('errors.description')}
        </p>
        {error && (
          <pre className="bg-earth-50 p-4 rounded text-sm text-earth-800 mb-4 overflow-auto">
            {error.message}
          </pre>
        )}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700"
        >
          {t('errors.retry')}
        </button>
      </div>
    </div>
  );
}