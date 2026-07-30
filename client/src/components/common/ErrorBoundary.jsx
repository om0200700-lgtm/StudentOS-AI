import React from 'react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
          <div className="max-w-md w-full glass-card p-8 rounded-2xl text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Something went wrong</h2>
            <p className="text-[var(--text-secondary)] mb-6 text-sm">
              We encountered an unexpected error. Our team has been notified.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="text-left bg-black/10 dark:bg-white/5 p-4 rounded-lg mb-6 overflow-auto max-h-48 text-xs text-red-500">
                <p className="font-bold">{this.state.error && this.state.error.toString()}</p>
                <pre className="mt-2">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()} variant="primary">
                Reload Page
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
