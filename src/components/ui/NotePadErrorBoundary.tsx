'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { NotePadError } from '@/types/notepad';

interface Props {
  children: ReactNode;
  onError?: (error: NotePadError) => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class NotePadErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('NotePad Error Boundary caught an error:', error, errorInfo);
    
    // Call the onError prop if provided
    if (this.props.onError) {
      const notePadError: NotePadError = Object.assign(error, {
        code: 'EDITOR_CRASH' as const,
        details: {
          componentStack: errorInfo.componentStack,
          errorBoundary: true,
        }
      });
      this.props.onError(notePadError);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-32 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 text-sm font-medium mb-2">
            Editor Error
          </div>
          <div className="text-red-500 text-xs text-center mb-3">
            The notepad encountered an error. Your content is still saved.
          </div>
          <button
            onClick={this.handleRetry}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}