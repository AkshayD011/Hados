/**
 * useRole — reactive hook that derives role-check booleans from AuthContext.
 *
 * Usage:
 *   const { isAdmin, isModerator, role, hasMinRole } = useRole();
 *
 * All values update automatically whenever the auth state changes.
 */
import { useAuth } from '../context/AuthContext';
import {
    isAdmin as checkAdmin,
    isModerator as checkModerator,
    isFaculty as checkFaculty,
    hasMinRole as checkMinRole,
    hasRole as checkRole,
    getRoleLabel,
    getRoleColor,
    ROLES,
} from '../utils/roles';

const useRole = () => {
    const { user, isAuthenticated } = useAuth();

    const role = user?.role ?? ROLES.STUDENT;

    return {
        /** The raw role string from the user document, defaults to 'student'. */
        role,

        /** True if the current user has the admin role. */
        isAdmin: checkAdmin(user),

        /** True if the current user has at least moderator privileges. */
        isModerator: checkModerator(user),

        /** True if the current user has at least faculty privileges. */
        isFaculty: checkFaculty(user),

        /** True if the user is authenticated with any role. */
        isAuthenticated,

        /**
         * Returns true if the current user has at least `minRole` privilege.
         * @param {string} minRole — one of ROLES.*
         */
        hasMinRole: (minRole) => checkMinRole(role, minRole),

        /**
         * Returns true if the current user has exactly `requiredRole`.
         * @param {string} requiredRole — one of ROLES.*
         */
        hasRole: (requiredRole) => checkRole(role, requiredRole),

        /** Human-readable label for the current role (e.g. "Admin"). */
        roleLabel: getRoleLabel(role),

        /** CSS colour token for the current role badge. */
        roleColor: getRoleColor(role),

        /** All role constants for convenience. */
        ROLES,
    };
};

export default useRole;
