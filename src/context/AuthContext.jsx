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
import { getDocument, createDocument } from '../services/firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [verificationPending, setVerificationPending] = useState(false);
    const [loading, setLoading] = useState(true);

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
                    console.error("Error fetching user data:", error);
                }
                
                if (firebaseUser.emailVerified) {
                    if (userData) {
                        setUser({ 
                            uid: firebaseUser.uid, 
                            emailVerified: true, 
                            ...userData 
                        });
                    } else {
                        setUser({ 
                            uid: firebaseUser.uid, 
                            email: firebaseUser.email, 
                            emailVerified: true 
                        });
                    }
                    setIsAuthenticated(true);
                    setVerificationPending(false);
                } else {
                    // Email not verified yet
                    setUser({ 
                        uid: firebaseUser.uid, 
                        email: firebaseUser.email, 
                        emailVerified: false 
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

    const register = async (email, password, rollNo, name, dept, year) => {
        if (!email.endsWith('@bl.students.amrita.edu')) {
            throw new Error('Only university emails (@bl.students.amrita.edu) are allowed. Please use your official university email to register.');
        }

        // eslint-disable-next-line no-useless-catch
        try {
            const userCredential = await firebaseRegister(email, password);
            const newUser = userCredential.user;

            // Send verification email
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
                createdAt: new Date().toISOString()
            };

            // Store extra user metadata in Firestore
            await createDocument('users', userData, newUser.uid);

            return { user: newUser, ...userData };
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const userCredential = await firebaseLogin(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseLogout();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

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
            // The onAuthChange listener will handle the rest
        }
    };

    const resetPassword = async (email) => {
        // eslint-disable-next-line no-useless-catch
        try {
            await firebaseReset(email);
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        isAuthenticated,
        verificationPending,
        loading,
        register,
        login,
        logout,
        resendVerification,
        checkVerification,
        resetPassword
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
