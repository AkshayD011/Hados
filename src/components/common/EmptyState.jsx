import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable EmptyState component — used across all pages.
 *
 * Props:
 *   icon       — Lucide icon component (rendered large, styled automatically)
 *   title      — Bold heading
 *   message    — Subtle supporting text
 *   action     — Optional { label, to, onClick } for a CTA button
 *   secondaryAction — Optional { label, to, onClick } for a secondary link
 *   compact    — If true, uses tighter padding (e.g., inside notification dropdown)
 */
const EmptyState = ({
    icon: Icon,
    title,
    message,
    action,
    secondaryAction,
    compact = false,
}) => {
    const padding = compact ? '1.5rem 1rem' : '3.5rem 2rem';

    return (
        <div
            className="animate-fade-in"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding,
                gap: '0.75rem',
            }}
        >
            {Icon && (
                <div style={{
                    width: compact ? '48px' : '64px',
                    height: compact ? '48px' : '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(155,34,66,0.08), rgba(155,34,66,0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.25rem',
                    flexShrink: 0,
                }}>
                    <Icon
                        size={compact ? 22 : 30}
                        color="var(--primary)"
                        style={{ opacity: 0.75 }}
                    />
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '320px' }}>
                <h3 style={{
                    margin: 0,
                    fontSize: compact ? '0.9375rem' : '1.1rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                }}>
                    {title}
                </h3>
                {message && (
                    <p style={{
                        margin: 0,
                        fontSize: compact ? '0.8rem' : '0.875rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.55',
                    }}>
                        {message}
                    </p>
                )}
            </div>

            {(action || secondaryAction) && (
                <div style={{
                    display: 'flex',
                    gap: '0.625rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: '0.5rem',
                }}>
                    {action && (
                        action.to ? (
                            <Link
                                to={action.to}
                                className="btn-primary"
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '0.625rem',
                                    fontSize: '0.875rem',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}
                            >
                                {action.icon && <action.icon size={15} />}
                                {action.label}
                            </Link>
                        ) : (
                            <button
                                onClick={action.onClick}
                                className="btn-primary"
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '0.625rem',
                                    fontSize: '0.875rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}
                            >
                                {action.icon && <action.icon size={15} />}
                                {action.label}
                            </button>
                        )
                    )}

                    {secondaryAction && (
                        secondaryAction.to ? (
                            <Link
                                to={secondaryAction.to}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '0.625rem',
                                    fontSize: '0.875rem',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    transition: 'border-color 0.2s, color 0.2s',
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
                                {secondaryAction.label}
                            </Link>
                        ) : (
                            <button
                                onClick={secondaryAction.onClick}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '0.625rem',
                                    fontSize: '0.875rem',
                                    border: '1px solid var(--border)',
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    transition: 'border-color 0.2s, color 0.2s',
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
                                {secondaryAction.label}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
