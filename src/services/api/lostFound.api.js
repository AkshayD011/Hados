import { 
    getDocument, 
    getCollection, 
    createDocument, 
    updateDocument, 
    deleteDocument,
    createQueryConstraint
} from '../firebase/firestore';

export const LF_STATUS = {
    PENDING:  'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

export const lostFoundApi = {
    /** Fetch all items (public or admin) */
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

    /** Fetch items filtered by status (for admin queue) */
    getItemsByStatus: async (status = null) => {
        try {
            // Fetch all items ordered by date, then filter client-side.
            // Note: Using where(status) + orderBy(createdAt) on different fields
            // requires a Firestore composite index. Client-side filtering avoids this.
            const all = await getCollection('lost_found', [
                createQueryConstraint.orderBy('createdAt', 'desc')
            ]);
            if (!status) return all;
            return all.filter(item => item.status === status);
        } catch (error) {
            console.error(`Error fetching items by status (${status}):`, error);
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
                status: LF_STATUS.PENDING, // Always start as pending
                createdAt: new Date().toISOString()
            });
            return { success: true, item: docData };
        } catch (error) {
            console.error("Error reporting item:", error);
            throw error;
        }
    },

    /** Update item status (Approve/Reject) */
    updateItemStatus: async (itemId, status) => {
        try {
            await updateDocument('lost_found', itemId, { status });
            return { success: true };
        } catch (error) {
            console.error(`Error updating item status (${itemId}):`, error);
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
