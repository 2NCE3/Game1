import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL UNCAUGHT COMPONENT ERROR:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center p-6 bg-space-950 text-white font-mono z-50">
          <div className="max-w-lg w-full bg-space-900 border border-red-500/80 rounded-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider border-b border-red-500/30 pb-3">
              <span className="px-1.5 py-0.5 rounded bg-red-950 border border-red-800 text-[10px] text-red-300">
                [SYSTEM FAULT]
              </span>
              <span>{this.props.fallbackTitle || 'MISSION SUBSYSTEM RUNTIME ERROR'}</span>
            </div>

            <div className="p-3 rounded bg-space-950 border border-slate-800 text-xs text-amber-300 font-mono overflow-auto max-h-36">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </div>

            {this.state.errorInfo?.componentStack && (
              <details className="text-[10px] text-slate-400">
                <summary className="cursor-pointer hover:text-slate-200 mb-1">
                  View Component Stack Details
                </summary>
                <pre className="p-2 bg-space-950 rounded border border-slate-800 overflow-x-auto text-[9px]">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 px-3 rounded-sm bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase transition-colors"
              >
                RE-INITIALIZE SUBSYSTEM
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="py-2 px-3 rounded-sm bg-space-800 hover:bg-space-700 text-slate-300 text-xs border border-slate-700 uppercase transition-colors"
              >
                RELOAD ENGINE
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
