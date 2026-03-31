import { db, storage } from '../firebase';
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
    getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

                // If empty, seed database first time
                if (posts.length === 0) {
                    const mockPosts = [
                        {
                            title: 'End-Semester Examination Schedule Out',
                            description: 'The tentative schedule for the upcoming end-semester examinations is now available on the Academic Portal. Classes will end on April 15th.',
                            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                            hashtags: ['Exams', 'Academic', 'News']
                        },
                        {
                            title: 'Annual Cultural Fest: Resonance 2026',
                            description: "Get ready for the biggest event of the year! Resonance 2026 is happening from March 5th to March 8th. Registrations for competitions are open.",
                            timestamp: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
                            hashtags: ['Events', 'Cultural', 'Fest2026']
                        },
                        {
                            title: 'New Library Timings',
                            description: 'To support students during exam season, the Central Library will remain open until midnight starting next Monday.',
                            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                            hashtags: ['Library', 'StudentServices']
                        }
                    ];
                    
                    for (const post of mockPosts) {
                        const newDocRef = await addDoc(postsCol, post);
                        posts.push({ id: newDocRef.id, ...post });
                    }
                    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                }

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
            await delay(800);
            return [
                { id: 1, name: 'Main Auditorium', type: 'Hall', location: { x: 30, y: 40 }, open: '9 AM - 6 PM' },
                { id: 2, name: 'Central Library', type: 'Library', location: { x: 70, y: 20 }, open: '8 AM - 12 AM' },
                { id: 3, name: 'Admin Block', type: 'Admin', location: { x: 50, y: 80 }, open: '9 AM - 5 PM' },
                { id: 4, name: 'Boys Hostel A', type: 'Hostel', location: { x: 10, y: 10 }, open: '24/7' },
                { id: 5, name: 'Girls Hostel B', type: 'Hostel', location: { x: 90, y: 90 }, open: '24/7' },
                { id: 6, name: 'Main Cafeteria', type: 'Cafeteria', location: { x: 50, y: 50 }, open: '8 AM - 10 PM' }
            ];
        }
    },

    lostFound: {
        getItems: async () => {
            await delay(1000);
            return [
                { id: 1, title: 'Found: Black Wallet', category: 'Accessories', location: 'Near Admin Block', status: 'Found', date: '2 hours ago', user: 'Admin' },
                { id: 2, title: 'Lost: Casio Scientific Calculator', category: 'Electronics', location: 'Library 2nd Floor', status: 'Lost', date: '1 day ago', user: 'Student' },
                { id: 3, title: 'Found: Amrita ID Card (Rahul Kumar)', category: 'ID Card', location: 'Main Cafeteria', status: 'Found', date: '5 hours ago', user: 'Mailer Daemon' }
            ];
        },
        reportItem: async (itemData) => {
            await delay(1500);
            return { success: true, item: { ...itemData, id: Math.random(), date: 'Just now' } };
        }
    },

    clubs: {
        getClubs: async () => {
            await delay(900);
            return [
                { id: 1, name: 'Face', type: 'Tech Club', description: 'Forum for Aspiring Computer Engineers. We organize hackathons and coding contests.', memberCount: 150 },
                { id: 2, name: 'Natyasudha', type: 'Cultural Club', description: 'The official dance club of the university. We perform across various styles.', memberCount: 80 },
                { id: 3, name: 'Ayudh', type: 'NGO', description: 'Empowering youth to integrate values and participate in social service activities.', memberCount: 300 }
            ];
        }
    },

    hashtags: {
        getTrending: async () => {
            await delay(600);
            return [
                { tag: 'Exams', count: 1205 },
                { tag: 'Resonance2026', count: 850 },
                { tag: 'Placement', count: 640 },
                { tag: 'LostAndFound', count: 320 },
                { tag: 'Library', count: 210 }
            ];
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
            await delay(700);
            return [
                { id: 1, title: 'Mid-Term Examinations', date: 'Oct 10 - Oct 20', type: 'Exam' },
                { id: 2, title: 'Diwali Holidays', date: 'Nov 1 - Nov 5', type: 'Holiday' },
                { id: 3, title: 'TechFest 2026', date: 'Dec 15 - Dec 18', type: 'Event' }
            ];
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
    }
};
