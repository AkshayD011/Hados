/**
 * useFormValidation — lightweight form validation hook.
 *
 * Usage:
 *   const { errors, validate, setFieldError, clearErrors } = useFormValidation(rules);
 *
 * rules: { fieldName: (value, allValues) => string | null }
 *   Return a string error message, or null/undefined if valid.
 *
 * validate(values) → boolean (true if all pass)
 */
import { useState, useCallback } from 'react';

const useFormValidation = (rules = {}) => {
    const [errors, setErrors] = useState({});

    const validate = useCallback((values) => {
        const newErrors = {};
        for (const field of Object.keys(rules)) {
            const error = rules[field](values[field], values);
            if (error) newErrors[field] = error;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [rules]);

    const setFieldError = useCallback((field, message) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    }, []);

    const clearFieldError = useCallback((field) => {
        setErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const clearErrors = useCallback(() => setErrors({}), []);

    return { errors, validate, setFieldError, clearFieldError, clearErrors };
};

export default useFormValidation;

// ─── Built-in validators ─────────────────────────────────────────────────────

export const required = (label) => (v) =>
    !v || !String(v).trim() ? `${label} is required.` : null;

export const minLength = (label, min) => (v) =>
    v && v.length < min ? `${label} must be at least ${min} characters.` : null;

export const maxLength = (label, max) => (v) =>
    v && v.length > max ? `${label} must be at most ${max} characters.` : null;

export const isEmail = (v) =>
    v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address.' : null;

export const isUniversityEmail = (v) =>
    v && !v.toLowerCase().endsWith('@bl.students.amrita.edu') && !v.toLowerCase().endsWith('@amrita.edu')
        ? 'Must be your university email (@bl.students.amrita.edu).'
        : null;

export const passwordStrength = (v) => {
    if (!v) return null;
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(v)) return 'Include at least one uppercase letter.';
    if (!/[0-9]/.test(v)) return 'Include at least one number.';
    return null;
};

export const combine = (...fns) => (v, all) => {
    for (const fn of fns) {
        const err = fn(v, all);
        if (err) return err;
    }
    return null;
};
