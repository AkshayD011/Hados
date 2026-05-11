import { getDocument, updateDocument } from '../firebase/firestore';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const profileApi = {
    verifyIdCard: async (userId, file) => {
        if (!userId || !file) throw new Error("Missing parameters");
        try {
            await delay(1500);
            
            await updateDocument('users', userId, {
                isIdVerified: true 
            });

            return { success: true, message: 'ID Verified successfully' };
        } catch (error) {
            console.error("Error verifying ID card:", error);
            throw error;
        }
    },
    updateProfile: async (userId, data) => {
        if (!userId) return;
        await updateDocument('users', userId, data);
        
        const snap = await getDocument('users', userId);
        const { _exists, _ref, ...userData } = snap;
        return userData;
    }
};
