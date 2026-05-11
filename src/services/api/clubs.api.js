/**
 * clubs.api.js
 *
 * Firestore schema for the `clubs` collection:
 *
 * clubs/{clubId}
 *   name          : string
 *   description   : string
 *   type          : string  ('Technical' | 'Cultural' | 'Social' | 'Sports' | 'NGO' | 'Other')
 *   contactEmail  : string
 *   memberCount   : number
 *   status        : 'pending' | 'approved' | 'rejected'
 *   rejectionNote : string | null   (reason given by admin when rejecting)
 *   submittedBy   : string          (uid)
 *   submitterEmail: string
 *   createdAt     : ISO string
 *   reviewedAt    : ISO string | null
 *   reviewedBy    : string | null   (admin uid)
 */
import {
    getDocument,
    getCollection,
    createDocument,
    updateDocument,
    deleteDocument,
    createQueryConstraint,
} from '../firebase/firestore';

// ─── Status constants ─────────────────────────────────────────────────────────

export const CLUB_STATUS = Object.freeze({
    PENDING:  'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
});

export const CLUB_TYPES = [
    'Technical',
    'Cultural',
    'Social',
    'Sports',
    'NGO',
    'Other',
];

// ─── API ──────────────────────────────────────────────────────────────────────

export const clubsApi = {
    /**
     * Public: fetch only APPROVED clubs (used in ClubsPage).
     * Deduplicates by name as before.
     */
    getClubs: async () => {
        try {
            const allClubs = await getCollection('clubs', [
                createQueryConstraint.where('status', '==', CLUB_STATUS.APPROVED),
            ]);

            if (allClubs.length === 0) return [];

            // Dedup by name (legacy safety)
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

            for (const id of duplicatesToDelete) {
                try { await deleteDocument('clubs', id); } catch { /* ignore */ }
            }

            return uniqueClubs;
        } catch (error) {
            console.error('Error fetching clubs:', error);
            throw error;
        }
    },

    /**
     * Admin: fetch clubs by status (or all if status = null).
     */
    getClubsByStatus: async (status = null) => {
        try {
            const constraints = [];
            if (status) constraints.push(createQueryConstraint.where('status', '==', status));
            return getCollection('clubs', constraints);
        } catch (error) {
            console.error('Error fetching clubs by status:', error);
            throw error;
        }
    },

    /**
     * User: submit a new club for admin approval.
     */
    submitClub: async ({ name, description, type, contactEmail, submittedBy, submitterEmail }) => {
        const data = {
            name:           name.trim(),
            description:    description.trim(),
            type:           type || 'Other',
            contactEmail:   contactEmail.trim(),
            memberCount:    1,
            status:         CLUB_STATUS.PENDING,
            rejectionNote:  null,
            submittedBy,
            submitterEmail,
            createdAt:      new Date().toISOString(),
            reviewedAt:     null,
            reviewedBy:     null,
        };
        return createDocument('clubs', data);
    },

    /**
     * Admin: approve a club submission.
     */
    approveClub: async (clubId, adminUid) => {
        return updateDocument('clubs', clubId, {
            status:       CLUB_STATUS.APPROVED,
            rejectionNote: null,
            reviewedAt:   new Date().toISOString(),
            reviewedBy:   adminUid,
        });
    },

    /**
     * Admin: reject a club submission with an optional note.
     */
    rejectClub: async (clubId, adminUid, rejectionNote = '') => {
        return updateDocument('clubs', clubId, {
            status:        CLUB_STATUS.REJECTED,
            rejectionNote: rejectionNote.trim() || null,
            reviewedAt:    new Date().toISOString(),
            reviewedBy:    adminUid,
        });
    },

    /**
     * Admin: hard-delete a club document.
     */
    deleteClub: async (clubId) => {
        return deleteDocument('clubs', clubId);
    },

    /**
     * User: increment member count.
     */
    joinClub: async (clubId) => {
        try {
            const clubSnap = await getDocument('clubs', clubId);
            if (clubSnap._exists) {
                const newCount = (clubSnap.memberCount || 0) + 1;
                await updateDocument('clubs', clubId, { memberCount: newCount });
                return { success: true, newCount };
            }
            return { success: false };
        } catch (error) {
            console.error('Error joining club:', error);
            throw error;
        }
    },
};
