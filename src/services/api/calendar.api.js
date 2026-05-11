import { getCollection } from '../firebase/firestore';

export const calendarApi = {
    getEvents: async () => {
        try {
            return await getCollection('calendar_events');
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            throw error;
        }
    }
};
