import { getCollection, createDocument, deleteDocument } from '../firebase/firestore';

export const mapApi = {
    getPOIs: async () => {
        try {
            const pois = await getCollection('pois');
            
            // Check if existing POIs are using the old X/Y format. If so, purge them.
            const needsMigration = pois.length > 0 && pois[0].location?.x !== undefined;
            if (needsMigration) {
                console.log("Migrating POIs to real geo-coordinates...");
                for (const p of pois) {
                    await deleteDocument('pois', p.id);
                }
            }

            if (pois.length === 0 || needsMigration) {
                const defaultPOIs = [
                    { name: 'Main Auditorium', type: 'Hall', location: { lat: 12.8765, lng: 77.6845 }, open: '9 AM - 6 PM' },
                    { name: 'Central Library', type: 'Library', location: { lat: 12.8768, lng: 77.6848 }, open: '8 AM - 12 AM' },
                    { name: 'Admin Block', type: 'Admin', location: { lat: 12.8770, lng: 77.6850 }, open: '9 AM - 5 PM' },
                    { name: 'Boys Hostel A', type: 'Hostel', location: { lat: 12.8750, lng: 77.6840 }, open: '24/7' },
                    { name: 'Girls Hostel B', type: 'Hostel', location: { lat: 12.8780, lng: 77.6835 }, open: '24/7' },
                    { name: 'Main Cafeteria', type: 'Cafeteria', location: { lat: 12.8760, lng: 77.6855 }, open: '8 AM - 10 PM' }
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
