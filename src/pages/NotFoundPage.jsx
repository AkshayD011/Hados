import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants/routes';

const NotFoundPage = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--background)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background glow blobs */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'var(--glow-1)',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'var(--glow-2)',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />

            <div className="glass card-base animate-fade-in" style={{
                maxWidth: '520px',
                width: '100%',
                padding: '3rem 2.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                position: 'relative'
            }}>
                {/* Animated 404 number */}
                <div style={{ position: 'relative' }}>
                    <span style={{
                        fontSize: 'clamp(5rem, 20vw, 8rem)',
                        fontWeight: '900',
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 50%, var(--accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.04em',
                        display: 'block',
                        userSelect: 'none'
                    }}>
                        404
                    </span>
                    {/* Floating compass icon overlay */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'spin404 8s linear infinite',
                        opacity: 0.15
                    }}>
                        <Compass size={80} color="var(--primary)" />
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    width: '60px',
                    height: '4px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg, var(--primary), var(--accent))'
                }} />

                {/* Message */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        margin: 0,
                        letterSpacing: '-0.02em'
                    }}>
                        Page Not Found
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        margin: 0
                    }}>
                        Looks like this page took a detour off-campus.
                        <br />
                        The URL you visited doesn&apos;t exist or may have moved.
                    </p>
                </div>

                {/* Action buttons */}
                <div style={{
                    display: 'flex',
                    gap: '0.875rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <Link
                        to={ROUTES.HOME}
                        className="btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.75rem',
                            textDecoration: 'none',
                            fontSize: '0.9375rem'
                        }}
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.75rem',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            fontWeight: '600',
                            fontSize: '0.9375rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

                {/* Footer note */}
                <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-tertiary)',
                    margin: 0,
                    marginTop: '0.5rem'
                }}>
                    Hados · Amrita School of Engineering
                </p>
            </div>

            {/* Spin animation for compass */}
            <style>{`
                @keyframes spin404 {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to   { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default NotFoundPage;
