import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthChange, 
    loginUser as firebaseLogin, 
    registerUser as firebaseRegister, 
    logoutUser as firebaseLogout,
    sendVerification,
    resetPassword as firebaseReset,
    reloadUser,
    getCurrentUser
} from '../services/firebase/auth';
import { getDocument, createDocument, updateDocument } from '../services/firebase/firestore';
import { DEFAULT_ROLE, isAdmin, isModerator, isFaculty, hasMinRole, hasRole, isValidRole, ROLES } from '../utils/roles';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [verificationPending, setVerificationPending] = useState(false);
    const [loading, setLoading] = useState(true);

    // ─── Auth state listener ──────────────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            if (firebaseUser) {
                let userData = null;
                try {
                    const userDoc = await getDocument('users', firebaseUser.uid);
                    if (userDoc._exists) {
                        userData = userDoc;
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }

                // Backfill: if the user document has no role field, add the default
                if (userData && !userData.role) {
                    try {
                        await updateDocument('users', firebaseUser.uid, { role: DEFAULT_ROLE });
                        userData.role = DEFAULT_ROLE;
                    } catch (err) {
                        console.warn('Could not backfill user role:', err);
                    }
                }

                if (firebaseUser.emailVerified) {
                    const resolvedUser = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        emailVerified: true,
                        role: DEFAULT_ROLE,    // safe fallback
                        ...(userData || {}),
                    };

                    setUser(resolvedUser);
                    setIsAuthenticated(true);
                    setVerificationPending(false);
                } else {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        emailVerified: false,
                        role: DEFAULT_ROLE,
                    });
                    setIsAuthenticated(false);
                    setVerificationPending(true);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setVerificationPending(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ─── Register ─────────────────────────────────────────────────────────────
    const register = async (email, password, rollNo, name, dept, year) => {
        if (!email.endsWith('@bl.students.amrita.edu')) {
            throw new Error(
                'Only university emails (@bl.students.amrita.edu) are allowed.'
            );
        }

        // eslint-disable-next-line no-useless-catch
        try {
            const userCredential = await firebaseRegister(email, password);
            const newUser = userCredential.user;

            await sendVerification(newUser);

            const userData = {
                email,
                rollNo,
                name,
                dept,
                year,
                bio: '',
                avatar: null,
                isIdVerified: false,
                role: DEFAULT_ROLE,          // ← always "student" on signup
                createdAt: new Date().toISOString(),
            };

            await createDocument('users', userData, newUser.uid);

            return { user: newUser, ...userData };
        } catch (error) {
            throw error;
        }
    };

    // ─── Login ────────────────────────────────────────────────────────────────
    const login = async (email, password) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const userCredential = await firebaseLogin(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    };

    // ─── Logout ───────────────────────────────────────────────────────────────
    const logout = async () => {
        try {
            await firebaseLogout();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // ─── Email verification helpers ───────────────────────────────────────────
    const resendVerification = async () => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            await sendVerification(currentUser);
        }
    };

    const checkVerification = async () => {
        const updatedUser = await reloadUser();
        if (updatedUser && updatedUser.emailVerified) {
            setVerificationPending(false);
            // onAuthChange listener will re-run and update the user state
        }
    };

    // ─── Password reset ───────────────────────────────────────────────────────
    const resetPassword = async (email) => {
        // eslint-disable-next-line no-useless-catch
        try {
            await firebaseReset(email);
        } catch (error) {
            throw error;
        }
    };

    // ─── Role management ─────────────────────────────────────────────────────
    /**
     * Update the role of any user document in Firestore.
     * Only admins should call this — enforce that in your UI with RoleGuard.
     *
     * @param {string} targetUid — UID of the user to update
     * @param {string} newRole   — must be a value from ROLES
     */
    const updateUserRole = async (targetUid, newRole) => {
        if (!isValidRole(newRole)) {
            throw new Error(`Invalid role "${newRole}". Valid roles are: ${Object.values(ROLES).join(', ')}.`);
        }
        await updateDocument('users', targetUid, { role: newRole });

        // If updating the currently logged-in user, reflect it immediately
        if (user && user.uid === targetUid) {
            setUser(prev => ({ ...prev, role: newRole }));
        }
    };

    // ─── Convenience role checks (derived from current user) ─────────────────
    const roleChecks = {
        /** True if the current user has the admin role. */
        isAdmin: isAdmin(user),

        /** True if the current user has at least moderator privileges. */
        isModerator: isModerator(user),

        /** True if the current user has at least faculty privileges. */
        isFaculty: isFaculty(user),

        /**
         * Check if the current user has at least `minRole` privilege.
         * @param {string} minRole
         */
        hasMinRole: (minRole) => hasMinRole(user?.role, minRole),

        /**
         * Check if the current user has exactly `requiredRole`.
         * @param {string} requiredRole
         */
        hasRole: (requiredRole) => hasRole(user?.role, requiredRole),
    };

    // ─── Context value ────────────────────────────────────────────────────────
    const value = {
        // State
        user,
        isAuthenticated,
        verificationPending,
        loading,

        // Auth actions
        register,
        login,
        logout,
        resendVerification,
        checkVerification,
        resetPassword,

        // Role management
        updateUserRole,
        ROLES,

        // Convenience role checks (mirrors useRole hook for simple consumers)
        ...roleChecks,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
