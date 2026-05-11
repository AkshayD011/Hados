/**
 * roles.js — Role-based access control (RBAC) utilities for Hados.
 *
 * Supported roles (in order of ascending privilege):
 *   student   — default for all new registrations
 *   moderator — can manage posts and flag content (future)
 *   faculty   — can post as a faculty authority (future)
 *   admin     — full platform access
 *
 * These are the ONLY places role strings should be defined.
 * Import ROLES and helpers from this file everywhere else.
 */

// ─── Role constants ───────────────────────────────────────────────────────────

export const ROLES = Object.freeze({
    STUDENT:   'student',
    MODERATOR: 'moderator',
    FACULTY:   'faculty',
    ADMIN:     'admin',
});

/** The role automatically assigned to every new registrant. */
export const DEFAULT_ROLE = ROLES.STUDENT;

/**
 * Privilege levels — higher number = more privileged.
 * Used by hasMinRole() to support "at least X" checks.
 */
const ROLE_LEVEL = {
    [ROLES.STUDENT]:   0,
    [ROLES.MODERATOR]: 1,
    [ROLES.FACULTY]:   2,
    [ROLES.ADMIN]:     3,
};

// ─── Guard helpers ────────────────────────────────────────────────────────────

/**
 * Returns true if the given role string is a known, valid role.
 * @param {string} role
 * @returns {boolean}
 */
export const isValidRole = (role) => Object.values(ROLES).includes(role);

/**
 * Returns true if `userRole` is exactly `requiredRole`.
 * Prefer hasMinRole() unless you need an exact match.
 * @param {string} userRole
 * @param {string} requiredRole
 * @returns {boolean}
 */
export const hasRole = (userRole, requiredRole) => userRole === requiredRole;

/**
 * Returns true if `userRole` has at least the privilege level of `minRole`.
 * Example: hasMinRole('admin', 'moderator') → true
 *          hasMinRole('student', 'admin')   → false
 * @param {string} userRole
 * @param {string} minRole
 * @returns {boolean}
 */
export const hasMinRole = (userRole, minRole) => {
    const userLevel = ROLE_LEVEL[userRole] ?? -1;
    const minLevel  = ROLE_LEVEL[minRole]  ?? Infinity;
    return userLevel >= minLevel;
};

/**
 * Returns true if the user object has the admin role.
 * Accepts the full user object as returned by AuthContext.
 * @param {{ role?: string } | null} user
 * @returns {boolean}
 */
export const isAdmin = (user) => user?.role === ROLES.ADMIN;

/**
 * Returns true if the user object has at least moderator privileges.
 * @param {{ role?: string } | null} user
 * @returns {boolean}
 */
export const isModerator = (user) => hasMinRole(user?.role, ROLES.MODERATOR);

/**
 * Returns true if the user object has at least faculty privileges.
 * @param {{ role?: string } | null} user
 * @returns {boolean}
 */
export const isFaculty = (user) => hasMinRole(user?.role, ROLES.FACULTY);

/**
 * Returns true if the user is authenticated (any role).
 * @param {{ role?: string } | null} user
 * @param {boolean} isAuthenticated
 * @returns {boolean}
 */
export const isLoggedIn = (user, isAuthenticated) =>
    isAuthenticated && user !== null;

/**
 * Returns the display label for a given role string.
 * Falls back to capitalising the raw string for unknown roles.
 * @param {string} role
 * @returns {string}
 */
export const getRoleLabel = (role) => {
    const labels = {
        [ROLES.STUDENT]:   'Student',
        [ROLES.MODERATOR]: 'Moderator',
        [ROLES.FACULTY]:   'Faculty',
        [ROLES.ADMIN]:     'Admin',
    };
    return labels[role] ?? (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown');
};

/**
 * Returns a colour token string suitable for inline use.
 * @param {string} role
 * @returns {string}
 */
export const getRoleColor = (role) => {
    const colors = {
        [ROLES.STUDENT]:   'var(--text-secondary)',
        [ROLES.MODERATOR]: '#3b82f6',
        [ROLES.FACULTY]:   '#8b5cf6',
        [ROLES.ADMIN]:     'var(--primary)',
    };
    return colors[role] ?? 'var(--text-tertiary)';
};
