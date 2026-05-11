import { 
    getDocument, 
    getCollection, 
    createDocument, 
    updateDocument, 
    deleteDocument,
    createQueryConstraint
} from '../firebase/firestore';

export const lostFoundApi = {
    getItems: async () => {
        try {
            return await getCollection('lost_found', [
                createQueryConstraint.orderBy('createdAt', 'desc')
            ]);
        } catch (error) {
            console.error("Error fetching lost/found items:", error);
            throw error;
        }
    },
    reportItem: async (itemData, imageFile) => {
        try {
            let imageUrl = null;
            
            if (imageFile) {
                imageUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });
            }

            const docData = await createDocument('lost_found', {
                ...itemData,
                imageUrl: imageUrl,
                createdAt: new Date().toISOString()
            });
            return { success: true, item: docData };
        } catch (error) {
            console.error("Error reporting item:", error);
            throw error;
        }
    },
    migrateEmails: async () => {
        try {
            const items = await getCollection('lost_found');
            for (const item of items) {
                if (!item.userEmail && item.uid) {
                    const userSnap = await getDocument('users', item.uid);
                    if (userSnap._exists && userSnap.email) {
                        await updateDocument('lost_found', item.id, { userEmail: userSnap.email });
                    }
                }
            }
            return true;
        } catch (error) {
            console.error("Migration failed:", error);
        }
    },
    deleteItem: async (itemId) => {
        try {
            await deleteDocument('lost_found', itemId);
            return { success: true };
        } catch (error) {
            console.error("Error deleting item:", error);
            throw error;
        }
    }
};
