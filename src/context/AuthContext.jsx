import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    sendEmailVerification 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [verificationPending, setVerificationPending] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    
                    if (firebaseUser.emailVerified) {
                        if (userDoc.exists()) {
                            setUser({ 
                                uid: firebaseUser.uid, 
                                emailVerified: true, 
                                ...userDoc.data() 
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
                } catch (error) {
                    console.error("Error fetching user data:", error);
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

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Send verification email
            await sendEmailVerification(newUser);

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
            await setDoc(doc(db, 'users', newUser.uid), userData);

            return { user: newUser, ...userData };
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const resendVerification = async () => {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
        }
    };

    const checkVerification = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload();
            // Manually trigger the current state changed logic
            const updatedUser = auth.currentUser;
            if (updatedUser.emailVerified) {
                setVerificationPending(false);
                // The onAuthStateChanged listener will handle the rest on the next cycle/reload
            }
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
        checkVerification
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
