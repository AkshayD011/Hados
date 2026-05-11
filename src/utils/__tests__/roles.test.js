/**
 * roles.test.js — unit tests for RBAC utility helpers.
 * Run with: npx vitest run src/utils/__tests__/roles.test.js
 *           or: npx jest src/utils/__tests__/roles.test.js
 */
import { describe, it, expect } from 'vitest';
import {
    ROLES,
    DEFAULT_ROLE,
    isValidRole,
    hasRole,
    hasMinRole,
    isAdmin,
    isModerator,
    isFaculty,
    getRoleLabel,
    getRoleColor,
} from '../roles';

// ── DEFAULT_ROLE ──────────────────────────────────────────────────────────────
describe('DEFAULT_ROLE', () => {
    it('should be "student"', () => {
        expect(DEFAULT_ROLE).toBe('student');
    });
});

// ── isValidRole ───────────────────────────────────────────────────────────────
describe('isValidRole', () => {
    it('accepts all defined roles', () => {
        Object.values(ROLES).forEach(r => expect(isValidRole(r)).toBe(true));
    });
    it('rejects unknown roles', () => {
        expect(isValidRole('superuser')).toBe(false);
        expect(isValidRole('')).toBe(false);
        expect(isValidRole(null)).toBe(false);
    });
});

// ── hasRole ───────────────────────────────────────────────────────────────────
describe('hasRole', () => {
    it('returns true for exact match', () => {
        expect(hasRole('admin', 'admin')).toBe(true);
        expect(hasRole('student', 'student')).toBe(true);
    });
    it('returns false for non-match', () => {
        expect(hasRole('student', 'admin')).toBe(false);
        expect(hasRole('admin', 'student')).toBe(false);
    });
});

// ── hasMinRole ────────────────────────────────────────────────────────────────
describe('hasMinRole', () => {
    it('admin passes all min-role checks', () => {
        expect(hasMinRole('admin', 'student')).toBe(true);
        expect(hasMinRole('admin', 'moderator')).toBe(true);
        expect(hasMinRole('admin', 'faculty')).toBe(true);
        expect(hasMinRole('admin', 'admin')).toBe(true);
    });
    it('student only passes student check', () => {
        expect(hasMinRole('student', 'student')).toBe(true);
        expect(hasMinRole('student', 'moderator')).toBe(false);
        expect(hasMinRole('student', 'admin')).toBe(false);
    });
    it('moderator passes student and moderator', () => {
        expect(hasMinRole('moderator', 'student')).toBe(true);
        expect(hasMinRole('moderator', 'moderator')).toBe(true);
        expect(hasMinRole('moderator', 'faculty')).toBe(false);
        expect(hasMinRole('moderator', 'admin')).toBe(false);
    });
    it('returns false for unknown role', () => {
        expect(hasMinRole('superuser', 'student')).toBe(false);
        expect(hasMinRole(undefined, 'student')).toBe(false);
    });
});

// ── isAdmin / isModerator / isFaculty ─────────────────────────────────────────
describe('isAdmin', () => {
    it('returns true only for admin user object', () => {
        expect(isAdmin({ role: 'admin' })).toBe(true);
        expect(isAdmin({ role: 'student' })).toBe(false);
        expect(isAdmin(null)).toBe(false);
        expect(isAdmin({})).toBe(false);
    });
});

describe('isModerator', () => {
    it('returns true for moderator and above', () => {
        expect(isModerator({ role: 'moderator' })).toBe(true);
        expect(isModerator({ role: 'faculty' })).toBe(true);
        expect(isModerator({ role: 'admin' })).toBe(true);
        expect(isModerator({ role: 'student' })).toBe(false);
        expect(isModerator(null)).toBe(false);
    });
});

describe('isFaculty', () => {
    it('returns true for faculty and above', () => {
        expect(isFaculty({ role: 'faculty' })).toBe(true);
        expect(isFaculty({ role: 'admin' })).toBe(true);
        expect(isFaculty({ role: 'moderator' })).toBe(false);
        expect(isFaculty({ role: 'student' })).toBe(false);
    });
});

// ── getRoleLabel ──────────────────────────────────────────────────────────────
describe('getRoleLabel', () => {
    it('returns correct labels', () => {
        expect(getRoleLabel('student')).toBe('Student');
        expect(getRoleLabel('admin')).toBe('Admin');
        expect(getRoleLabel('moderator')).toBe('Moderator');
        expect(getRoleLabel('faculty')).toBe('Faculty');
    });
    it('capitalises unknown roles', () => {
        expect(getRoleLabel('superpower')).toBe('Superpower');
    });
    it('handles null/undefined', () => {
        expect(getRoleLabel(null)).toBe('Unknown');
        expect(getRoleLabel(undefined)).toBe('Unknown');
    });
});

// ── getRoleColor ──────────────────────────────────────────────────────────────
describe('getRoleColor', () => {
    it('returns a string for all defined roles', () => {
        Object.values(ROLES).forEach(r => {
            expect(typeof getRoleColor(r)).toBe('string');
        });
    });
    it('falls back for unknown roles', () => {
        expect(getRoleColor('ghost')).toBe('var(--text-tertiary)');
    });
});
