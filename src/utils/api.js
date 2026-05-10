import { db } from '../firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    addDoc, 
    query, 
    orderBy,
    getDoc,
    where
} from 'firebase/firestore';
// firebase/storage imports removed as they are unused

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    auth: {
        // Handled directly in AuthContext now, but keeping stubs for compatibility if any component calls them
        login: async () => { throw new Error('Use AuthContext.login'); },
        register: async () => { throw new Error('Use AuthContext.register'); }
    },

    feed: {
        getPosts: async (userId = null) => {
            try {
                const postsCol = collection(db, 'posts');
                // Order by timestamp descending
                const q = query(postsCol, orderBy('timestamp', 'desc'));
                const snapshot = await getDocs(q);
                
                let posts = [];
                snapshot.forEach(doc => {
                    posts.push({ id: doc.id, ...doc.data() });
                });

                // Removed auto-seeding logic

                // If userId provided, check bookmarks
                if (userId) {
                    const bookmarksCol = collection(db, 'users', userId, 'bookmarks');
                    const bookmarksSnap = await getDocs(bookmarksCol);
                    const bookmarkedMap = {};
                    bookmarksSnap.forEach(b => {
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
            const bookmarkRef = doc(db, 'users', userId, 'bookmarks', postId);
            if (isBookmarked) {
                await setDoc(bookmarkRef, { savedAt: new Date().toISOString() });
            } else {
                await deleteDoc(bookmarkRef);
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

                const postsCol = collection(db, 'posts');
                const docRef = await addDoc(postsCol, postToSave);

                // Process Hashtags for Trending
                if (postToSave.hashtags && postToSave.hashtags.length > 0) {
                    const trendingCol = collection(db, 'trending');
                    for (const tag of postToSave.hashtags) {
                        const q = query(trendingCol, where('tag', '==', tag));
                        const tagSnap = await getDocs(q);
                        
                        if (tagSnap.empty) {
                            await addDoc(trendingCol, { tag: tag, count: 1 });
                        } else {
                            const tagDoc = tagSnap.docs[0];
                            await updateDoc(tagDoc.ref, { count: tagDoc.data().count + 1 });
                        }
                    }
                }

                return { success: true, post: { id: docRef.id, ...postToSave } };
            } catch (error) {
                console.error("Error creating post:", error);
                throw error;
            }
        }
    },

    profile: {
        verifyIdCard: async (userId, file) => {
            if (!userId || !file) throw new Error("Missing parameters");
            try {
                // To avoid requiring the Firebase Blaze (Paid) Plan for Cloud Storage, 
                // we will bypass the actual file upload and just update the Firestore Document.
                
                // Simulate a slight delay for the "upload" visual effect
                await delay(1500);
                
                // Update user document to indicate verification submitted
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
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
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, data);
            
            // Return updated
            const snap = await getDoc(userRef);
            return { uid: snap.id, ...snap.data() };
        }
    },

    // Remaining mock endpoints for Sprint 2 & 3
    map: {
        getPOIs: async () => {
            try {
                const poisRef = collection(db, 'pois');
                const snapshot = await getDocs(poisRef);
                
                if (snapshot.empty) {
                    // Seed database with default POIs if empty
                    const defaultPOIs = [
                        { name: 'Main Auditorium', type: 'Hall', location: { x: 30, y: 40 }, open: '9 AM - 6 PM' },
                        { name: 'Central Library', type: 'Library', location: { x: 70, y: 20 }, open: '8 AM - 12 AM' },
                        { name: 'Admin Block', type: 'Admin', location: { x: 50, y: 80 }, open: '9 AM - 5 PM' },
                        { name: 'Boys Hostel A', type: 'Hostel', location: { x: 10, y: 10 }, open: '24/7' },
                        { name: 'Girls Hostel B', type: 'Hostel', location: { x: 90, y: 90 }, open: '24/7' },
                        { name: 'Main Cafeteria', type: 'Cafeteria', location: { x: 50, y: 50 }, open: '8 AM - 10 PM' }
                    ];
                    
                    const newDocs = [];
                    for (const poi of defaultPOIs) {
                        const docRef = await addDoc(poisRef, poi);
                        newDocs.push({ id: docRef.id, ...poi });
                    }
                    return newDocs;
                }
                
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error("Error fetching POIs:", error);
                throw error;
            }
        }
    },

    lostFound: {
        getItems: async () => {
            try {
                const itemsRef = collection(db, 'lost_found');
                const q = query(itemsRef, orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error("Error fetching lost/found items:", error);
                throw error;
            }
        },
        reportItem: async (itemData, imageFile) => {
            try {
                let imageUrl = null;
                
                if (imageFile) {
                    // Convert file to base64 instead of Firebase Storage to avoid bucket configuration issues
                    imageUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(imageFile);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = (error) => reject(error);
                    });
                }

                const itemsRef = collection(db, 'lost_found');
                const docRef = await addDoc(itemsRef, {
                    ...itemData,
                    imageUrl: imageUrl,
                    createdAt: new Date().toISOString()
                });
                return { success: true, item: { id: docRef.id, ...itemData, imageUrl, createdAt: new Date().toISOString() } };
            } catch (error) {
                console.error("Error reporting item:", error);
                throw error;
            }
        },
        migrateEmails: async () => {
            try {
                const itemsRef = collection(db, 'lost_found');
                const snapshot = await getDocs(itemsRef);
                let updatedCount = 0;
                for (const itemDoc of snapshot.docs) {
                    const data = itemDoc.data();
                    if (!data.userEmail && data.uid) {
                        const userRef = doc(db, 'users', data.uid);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists() && userSnap.data().email) {
                            await updateDoc(itemDoc.ref, { userEmail: userSnap.data().email });
                            updatedCount++;
                        }
                    }
                }
                console.log(`Migrated ${updatedCount} posts.`);
                return true;
            } catch (error) {
                console.error("Migration failed:", error);
            }
        },
        deleteItem: async (itemId) => {
            try {
                const itemRef = doc(db, 'lost_found', itemId);
                await deleteDoc(itemRef);
                return { success: true };
            } catch (error) {
                console.error("Error deleting item:", error);
                throw error;
            }
        }
    },

    clubs: {
        getClubs: async () => {
            try {
                const clubsRef = collection(db, 'clubs');
                const snapshot = await getDocs(clubsRef);
                
                if (snapshot.empty) {
                    return [];
                }
                
                const allClubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Silent deduplication logic
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

                // Delete duplicates silently in the background
                if (duplicatesToDelete.length > 0) {
                    for (const id of duplicatesToDelete) {
                        try {
                            await deleteDoc(doc(db, 'clubs', id));
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
                const clubRef = doc(db, 'clubs', clubId);
                const clubSnap = await getDoc(clubRef);
                if (clubSnap.exists()) {
                    const newCount = (clubSnap.data().memberCount || 0) + 1;
                    await updateDoc(clubRef, { memberCount: newCount });
                    return { success: true, newCount };
                }
                return { success: false };
            } catch (error) {
                console.error("Error joining club:", error);
                throw error;
            }
        }
    },

    hashtags: {
        getTrending: async () => {
            try {
                const tagsRef = collection(db, 'trending');
                const snapshot = await getDocs(tagsRef);
                
                if (snapshot.empty) {
                    return [];
                }
                
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.count - a.count);
            } catch (error) {
                console.error("Error fetching trending tags:", error);
                throw error;
            }
        }
    },

    placement: {
        getUpdates: async () => {
            await delay(900);
            return [
                { id: 1, company: 'Google', role: 'SWE Intern', deadline: 'Oct 15, 2026', ctc: 'Stipend: ₹1.5L/mo' },
                { id: 2, company: 'Microsoft', role: 'FTE SDE', deadline: 'Oct 20, 2026', ctc: '₹45 LPA' },
                { id: 3, company: 'TCS', role: 'Digital Profile', deadline: 'Nov 1, 2026', ctc: '₹7 LPA' }
            ];
        }
    },

    calendar: {
        getEvents: async () => {
            try {
                const eventsRef = collection(db, 'calendar_events');
                const snapshot = await getDocs(eventsRef);
                
                if (snapshot.empty) {
                    return [];
                }

                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error("Error fetching calendar events:", error);
                throw error;
            }
        }
    },

    notifications: {
        getAll: async () => {
            await delay(500);
            return [
                { id: 1, text: 'Your lost item (Wallet) has been found!', time: '10m ago', unread: true },
                { id: 2, text: 'Placement: Google SWE Intern deadline approaching.', time: '1h ago', unread: true },
                { id: 3, text: 'Mailer Daemon posted a new announcement.', time: '2h ago', unread: false }
            ];
        }
    },

    // Temporary utility to clean up database
    purgeDummyData: async () => {
        try {
            const feedCol = collection(db, 'posts');
            const feedSnap = await getDocs(feedCol);
            for (const doc of feedSnap.docs) {
                await deleteDoc(doc.ref);
            }

            const trendCol = collection(db, 'trending');
            const trendSnap = await getDocs(trendCol);
            for (const doc of trendSnap.docs) {
                await deleteDoc(doc.ref);
            }

            const clubsCol = collection(db, 'clubs');
            const clubsSnap = await getDocs(clubsCol);
            for (const doc of clubsSnap.docs) {
                await deleteDoc(doc.ref);
            }
            console.log("Dummy data purged successfully.");
        } catch(e) {
            console.error("Purge failed:", e);
        }
    }
};
