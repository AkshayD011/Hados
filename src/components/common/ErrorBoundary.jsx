import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'var(--background)'
                }}>
                    <div className="glass card-base animate-fade-in" style={{
                        maxWidth: '500px',
                        width: '100%',
                        padding: '2.5rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#f44336'
                        }}>
                            <AlertTriangle size={40} />
                        </div>
                        
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                Oops! Something went wrong
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                We're sorry, but the application encountered an unexpected error. 
                                Our team has been notified.
                            </p>
                        </div>

                        {import.meta.env.DEV && this.state.error && (
                            <div style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: 'rgba(244, 67, 54, 0.05)',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(244, 67, 54, 0.2)',
                                textAlign: 'left',
                                overflowX: 'auto'
                            }}>
                                <p style={{ color: '#f44336', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <button 
                            onClick={this.handleReset}
                            className="btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 2rem'
                            }}
                        >
                            <RefreshCw size={18} /> Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
