'use client';
import React from 'react';

interface Props {
    children: React.ReactNode;
    fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary] caught render error:', error, info);
    }

    private reset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.reset);
            }
            return (
                <div className="min-h-[60vh] flex items-center justify-center px-6">
                    <div className="max-w-md w-full bg-[#bbada0] rounded-lg p-6 text-center text-white shadow-lg">
                        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                        <p className="text-sm opacity-90 mb-4 break-words">
                            {this.state.error.message || 'An unexpected error occurred.'}
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={this.reset}
                                className="bg-[#8f7a66] text-white rounded px-4 py-2 hover:bg-[#7c6b5a] transition-colors"
                            >
                                Try again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-[#3c3a32] text-white rounded px-4 py-2 hover:bg-[#2c2a22] transition-colors"
                            >
                                Reload page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
