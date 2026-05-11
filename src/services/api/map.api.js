import { getCollection, createDocument } from '../firebase/firestore';

export const mapApi = {
    getPOIs: async () => {
        try {
            const pois = await getCollection('pois');
            
            if (pois.length === 0) {
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
                    const docData = await createDocument('pois', poi);
                    newDocs.push(docData);
                }
                return newDocs;
            }
            
            return pois;
        } catch (error) {
            console.error("Error fetching POIs:", error);
            throw error;
        }
    }
};
