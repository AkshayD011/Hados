import { 
    getCollection, 
    createDocument, 
    updateDocument, 
    deleteDocument,
    createQueryConstraint
} from '../firebase/firestore';

export const feedApi = {
    getPosts: async (userId = null) => {
        try {
            let posts = await getCollection('posts', [
                createQueryConstraint.orderBy('timestamp', 'desc')
            ]);

            if (userId) {
                const bookmarks = await getCollection(`users/${userId}/bookmarks`);
                const bookmarkedMap = {};
                bookmarks.forEach(b => {
                    bookmarkedMap[b.id] = true;
                });
                
                posts = posts.map(post => ({
                    ...post,
                    bookmarked: !!bookmarkedMap[post.id]
                }));
            }

            return posts;
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    },
    toggleBookmark: async (userId, postId, isBookmarked) => {
        if (!userId) return;
        if (isBookmarked) {
            await createDocument(`users/${userId}/bookmarks`, { savedAt: new Date().toISOString() }, postId);
        } else {
            await deleteDocument(`users/${userId}/bookmarks`, postId);
        }
    },
    createPost: async (postData, imageFile) => {
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

            const postToSave = {
                ...postData,
                imageUrl,
                timestamp: new Date().toISOString(),
                hashtags: postData.hashtags || []
            };

            const newPost = await createDocument('posts', postToSave);

            if (postToSave.hashtags && postToSave.hashtags.length > 0) {
                for (const tag of postToSave.hashtags) {
                    const tags = await getCollection('trending', [
                        createQueryConstraint.where('tag', '==', tag)
                    ]);
                    
                    if (tags.length === 0) {
                        await createDocument('trending', { tag: tag, count: 1 });
                    } else {
                        const tagDoc = tags[0];
                        await updateDocument('trending', tagDoc.id, { count: tagDoc.count + 1 });
                    }
                }
            }

            return { success: true, post: newPost };
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    },

    /** Alias used by the admin panel to fetch all posts */
    getFeed: async () => {
        try {
            return await getCollection('posts', [
                createQueryConstraint.orderBy('timestamp', 'desc')
            ]);
        } catch (error) {
            console.error("Error fetching feed:", error);
            throw error;
        }
    },

    /** Delete a post by ID */
    deletePost: async (postId) => {
        try {
            await deleteDocument('posts', postId);
            return { success: true };
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    }
};
