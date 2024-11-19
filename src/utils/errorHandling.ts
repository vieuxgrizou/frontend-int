import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'error' | 'warning' | 'info' = 'error',
    public data?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    switch (error.severity) {
      case 'error':
        toast.error(error.message);
        break;
      case 'warning':
        toast.warning(error.message);
        break;
      case 'info':
        toast.info(error.message);
        break;
    }
    
    console.error('Application error:', {
      code: error.code,
      message: error.message,
      data: error.data
    });
  } else if (error instanceof Error) {
    toast.error('An unexpected error occurred');
    console.error('Unexpected error:', error);
  } else {
    toast.error('An unknown error occurred');
    console.error('Unknown error:', error);
  }
}

export function throwAppError(
  message: string,
  code: string,
  severity: 'error' | 'warning' | 'info' = 'error',
  data?: any
): never {
  throw new AppError(message, code, severity, data);
}