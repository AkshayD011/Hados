import { getDocument, getCollection, updateDocument, deleteDocument } from '../firebase/firestore';

export const clubsApi = {
    getClubs: async () => {
        try {
            const allClubs = await getCollection('clubs');
            
            if (allClubs.length === 0) {
                return [];
            }
            
            const seenNames = new Set();
            const uniqueClubs = [];
            const duplicatesToDelete = [];

            for (const club of allClubs) {
                if (seenNames.has(club.name)) {
                    duplicatesToDelete.push(club.id);
                } else {
                    seenNames.add(club.name);
                    uniqueClubs.push(club);
                }
            }

            if (duplicatesToDelete.length > 0) {
                for (const id of duplicatesToDelete) {
                    try {
                        await deleteDocument('clubs', id);
                    } catch (e) {
                        console.error("Error deleting duplicate:", e);
                    }
                }
            }
            
            return uniqueClubs;
        } catch (error) {
            console.error("Error fetching clubs:", error);
            throw error;
        }
    },
    joinClub: async (clubId) => {
        try {
            const clubSnap = await getDocument('clubs', clubId);
            if (clubSnap._exists) {
                const newCount = (clubSnap.memberCount || 0) + 1;
                await updateDocument('clubs', clubId, { memberCount: newCount });
                return { success: true, newCount };
            }
            return { success: false };
        } catch (error) {
            console.error("Error joining club:", error);
            throw error;
        }
    }
};
