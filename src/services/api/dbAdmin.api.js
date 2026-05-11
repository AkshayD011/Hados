import { getCollection, deleteDocument } from '../firebase/firestore';

export const dbAdminApi = {
    purgeDummyData: async () => {
        try {
            const feedSnap = await getCollection('posts');
            for (const doc of feedSnap) {
                await deleteDocument('posts', doc.id);
            }

            const trendSnap = await getCollection('trending');
            for (const doc of trendSnap) {
                await deleteDocument('trending', doc.id);
            }

            const clubsSnap = await getCollection('clubs');
            for (const doc of clubsSnap) {
                await deleteDocument('clubs', doc.id);
            }
        } catch(e) {
            console.error("Purge failed:", e);
        }
    }
};
