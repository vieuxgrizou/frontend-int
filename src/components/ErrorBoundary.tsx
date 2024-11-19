import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-paper p-6 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-dark-primary">
              Une erreur est survenue
            </h2>
            {this.state.error && (
              <pre className="bg-gray-50 dark:bg-dark-hover p-4 rounded text-sm text-gray-800 dark:text-dark-secondary mb-4 overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="button-primary"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}