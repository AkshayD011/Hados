import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * FieldError — displays a red inline error message below a form input.
 * Shows nothing when there is no error.
 */
export const FieldError = ({ error }) => {
    if (!error) return null;
    return (
        <div
            role="alert"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginTop: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--error, #dc3545)',
                animation: 'fadeInDown 0.15s ease'
            }}
        >
            <AlertCircle size={13} style={{ flexShrink: 0 }} />
            {error}
        </div>
    );
};

/**
 * FieldSuccess — green inline success hint (e.g. "Strong password ✓").
 */
export const FieldSuccess = ({ message }) => {
    if (!message) return null;
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginTop: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: 'var(--success, #28a745)',
            }}
        >
            <CheckCircle size={13} style={{ flexShrink: 0 }} />
            {message}
        </div>
    );
};

/**
 * inputStyle — returns the inline border style for an input,
 * changing to red when there's an error and green when valid & touched.
 *
 * Usage: style={{ ...baseInputStyle, ...inputBorderStyle(error, touched) }}
 */
export const inputBorderStyle = (error, touched = false, valid = false) => ({
    borderColor: error
        ? 'var(--error, #dc3545)'
        : touched && valid
        ? 'var(--success, #28a745)'
        : 'var(--border)',
    boxShadow: error
        ? '0 0 0 3px rgba(220, 53, 69, 0.1)'
        : touched && valid
        ? '0 0 0 3px rgba(40, 167, 69, 0.1)'
        : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
});

/**
 * PasswordStrengthBar — visual strength indicator (0–4 bars).
 */
export const PasswordStrengthBar = ({ password }) => {
    if (!password) return null;

    const score = (() => {
        let s = 0;
        if (password.length >= 8) s++;
        if (password.length >= 12) s++;
        if (/[A-Z]/.test(password)) s++;
        if (/[0-9]/.test(password)) s++;
        if (/[^a-zA-Z0-9]/.test(password)) s++;
        return Math.min(s, 4);
    })();

    const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#28a745'];

    return (
        <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.3rem' }}>
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            backgroundColor: i <= score ? colors[score] : 'var(--border)',
                            transition: 'background-color 0.3s ease',
                        }}
                    />
                ))}
            </div>
            <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: colors[score],
                transition: 'color 0.3s ease',
            }}>
                {labels[score]}
            </span>
        </div>
    );
};

export default FieldError;
