import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SiliconUrja React ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            SiliconUrja System Recovery
          </h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            The application intercepted a runtime exception. You can reload the session or review the diagnostic details below.
          </p>

          <div className="w-full max-w-xl bg-slate-950 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs text-rose-300 mb-6 overflow-x-auto">
            {this.state.error?.toString()}
          </div>

          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
