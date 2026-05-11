import { auth } from './config';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'firebase/auth';

export const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
    return await signOut(auth);
};

export const sendVerification = async (user) => {
    return await sendEmailVerification(user);
};

export const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
};

export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const reloadUser = async () => {
    if (auth.currentUser) {
        await auth.currentUser.reload();
        return auth.currentUser;
    }
    return null;
};

export const getCurrentUser = () => {
    return auth.currentUser;
};
