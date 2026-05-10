/**
 * One-time script to seed academic calendar events into Firestore.
 * Run with: node src/scripts/seedCalendar.js
 *
 * Uses the Firebase Admin-style approach via the client SDK
 * (reuses the same firebase config from the app).
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

// ── Firebase config (mirror of src/firebase.js) ──
// We duplicate here so this script can run standalone via Node.
const firebaseConfig = {
    apiKey: "AIzaSyCunOBeeuYP1KOU_vySJRdfHKEZcc-YJ0Q",
    authDomain: "hados-e5220.firebaseapp.com",
    projectId: "hados-e5220",
    storageBucket: "hados-e5220.firebasestorage.app",
    messagingSenderId: "91922861807",
    appId: "1:919228618072:web:db879c4076dff942a8812d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Academic Calendar Events 2025-26 Even Semester ──
// Extracted from "Academic Calendar 2025-26 Even Sem.pdf"
const events = [
    // ─── January 2026 ───
    { title: "New Year's Day", date: "Jan 1, 2026", type: "Holiday" },
    { title: "Commencement of Classes (UG & PG)", date: "Jan 5, 2026", type: "Academic" },
    { title: "Makar Sankranti", date: "Jan 15, 2026", type: "Holiday" },
    { title: "First Class/Course Committee Meeting", date: "Jan 17, 2026", type: "Meeting", description: "Discussion of course plan and evaluation scheme" },
    { title: "Republic Day", date: "Jan 26, 2026", type: "Holiday" },
    { title: "Identification of Slow Learners", date: "Jan 31, 2026", type: "Academic", description: "Discussion of remedial measures for performance improvement in Class/Course Committee meetings" },

    // ─── February 2026 ───
    { title: "Sports Day", date: "Feb 21, 2026", type: "Event" },

    // ─── March 2026 ───
    { title: "Maha Shivaratri", date: "Mar 4, 2026", type: "Holiday" },
    { title: "Commencement of Mid Semester Exam", date: "Mar 9, 2026", type: "Exam" },
    { title: "Entry of Mid Sem Marks in Shikshak", date: "Mar 16, 2026", type: "Academic" },
    { title: "Holi Festival", date: "Mar 19, 2026", type: "Holiday" },
    { title: "Chandramana Ugadi", date: "Mar 27, 2026", type: "Holiday" },
    { title: "Sri Ramanavami", date: "Mar 28, 2026", type: "Holiday" },

    // ─── April 2026 ───
    { title: "Missed Mid Term Exam (All)", date: "Apr 3, 2026", type: "Exam" },
    { title: "Dr. Ambedkar Jayanthi", date: "Apr 14, 2026", type: "Holiday" },
    { title: "Amritotsav '26", date: "Apr 25, 2026", type: "Event" },
    { title: "Class/Course Committee Meeting", date: "Apr 30, 2026", type: "Meeting" },

    // ─── May 2026 ───
    { title: "May Day", date: "May 1, 2026", type: "Holiday" },
    { title: "Friday Timetable for All", date: "May 2, 2026", type: "Academic", description: "Saturday follows Friday timetable" },
    { title: "Last Instruction Day (All)", date: "May 12, 2026", type: "Academic" },
    { title: "Pre-registration & Attendance Finalisation", date: "May 13 - May 15, 2026", type: "Academic", description: "Finalisation of attendance shortage, faculty feedback, course end survey" },
    { title: "Commencement of End Semester Exam", date: "May 16, 2026", type: "Exam" },

    // ─── June 2026 ───
    { title: "End Semester Exams Continue", date: "Jun 1 - Jun 30, 2026", type: "Exam", description: "End semester examination period" },
];

async function seed() {
    const colRef = collection(db, 'calendar_events');

    // Clear existing events first
    console.log('🗑️  Clearing existing calendar events...');
    const existing = await getDocs(colRef);
    for (const doc of existing.docs) {
        await deleteDoc(doc.ref);
    }
    console.log(`   Deleted ${existing.size} old events.`);

    // Seed new events
    console.log('📅 Seeding calendar events...');
    for (const event of events) {
        await addDoc(colRef, {
            ...event,
            createdAt: new Date().toISOString()
        });
        console.log(`   ✅ ${event.title}`);
    }

    console.log(`\n🎉 Done! Seeded ${events.length} events into Firestore.`);
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
