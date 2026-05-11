import { getCollection } from '../firebase/firestore';

export const calendarApi = {
    getEvents: async () => {
        try {
            return await getCollection('calendar_events');
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            throw error;
        }
    },
    // Temporary client-side seeder
    seedEvents: async () => {
        const { createDocument, getCollection, deleteDocument } = await import('../firebase/firestore');
        const colRef = 'calendar_events';
        
        // 1. Clear old
        const existing = await getCollection(colRef);
        for(const doc of existing) {
            await deleteDocument(colRef, doc.id);
        }

        // 2. Add new
        const events = [
            { title: "New Year's Day", date: "Jan 1, 2026", type: "Holiday" },
            { title: "Commencement of Classes (UG & PG)", date: "Jan 5, 2026", type: "Academic" },
            { title: "First Class/Course Committee Meeting", date: "Jan 7 - Jan 9, 2026", type: "Meeting", description: "Discussion of course plan and evaluation scheme" },
            { title: "Makar Sankranti", date: "Jan 15, 2026", type: "Holiday" },
            { title: "Republic Day", date: "Jan 26, 2026", type: "Holiday" },
            { title: "Identification of Slow Learners", date: "Jan 31, 2026", type: "Academic", description: "Discussion of remedial measures for performance improvement in Class/Course Committee meetings" },
            { title: "Sports Day", date: "Feb 21, 2026", type: "Event" },
            { title: "Holi Festival", date: "Mar 4, 2026", type: "Holiday" },
            { title: "Commencement of Mid Semester Exam", date: "Mar 9, 2026", type: "Exam" },
            { title: "Entry of Mid Sem Marks in Shikshak", date: "Mar 16, 2026", type: "Academic" },
            { title: "Chandramana Ugadi", date: "Mar 19, 2026", type: "Holiday" },
            { title: "Sri Ramanavami", date: "Mar 27, 2026", type: "Holiday" },
            { title: "Missed Mid Term Exam (All)", date: "Apr 3, 2026", type: "Exam" },
            { title: "Dr. Ambedkar Jayanthi", date: "Apr 14, 2026", type: "Holiday" },
            { title: "Amritakalanjali", date: "Apr 24, 2026", type: "Event" },
            { title: "Amritotsav '26", date: "Apr 25, 2026", type: "Event" },
            { title: "Class/Course Committee Meeting", date: "Apr 30, 2026", type: "Meeting" },
            { title: "May Day", date: "May 1, 2026", type: "Holiday" },
            { title: "Friday Timetable for All", date: "May 2, 2026", type: "Academic", description: "Saturday follows Friday timetable" },
            { title: "Last Instruction Day (All)", date: "May 11, 2026", type: "Academic" },
            { title: "Pre-registration & Attendance Finalisation", date: "May 12 - May 15, 2026", type: "Academic", description: "Finalisation of attendance shortage, faculty feedback, course end survey" },
            { title: "Commencement of End Semester Exam", date: "May 16, 2026", type: "Exam" }
        ];

        for(const event of events) {
            await createDocument(colRef, {
                ...event,
                createdAt: new Date().toISOString()
            });
        }
        return true;
    }
};
