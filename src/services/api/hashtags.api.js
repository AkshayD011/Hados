import { getCollection } from '../firebase/firestore';

export const hashtagsApi = {
    getTrending: async () => {
        try {
            const tags = await getCollection('trending');
            
            if (tags.length === 0) {
                return [];
            }
            
            return tags.sort((a, b) => b.count - a.count);
        } catch (error) {
            console.error("Error fetching trending tags:", error);
            throw error;
        }
    }
};
