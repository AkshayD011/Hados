/**
 * moderation.api.js
 *
 * Firestore schema for reports collection:
 * reports/{reportId}
 *   type          : 'post' | 'comment'
 *   targetId      : string   (postId or commentId)
 *   targetTitle   : string   (snapshot of title for display)
 *   targetContent : string   (snapshot of content)
 *   targetAuthorId: string
 *   reason        : string   (enum — see REPORT_REASONS)
 *   details       : string   (optional free-text)
 *   reportedBy    : string   (uid)
 *   reporterEmail : string
 *   status        : 'pending' | 'resolved' | 'dismissed'
 *   action        : 'none' | 'deleted' | 'warned'
 *   createdAt     : ISO string
 *   resolvedAt    : ISO string | null
 *   resolvedBy    : string | null
 */
import {
    getCollection,
    createDocument,
    updateDocument,
    deleteDocument,
    createQueryConstraint,
} from '../firebase/firestore';

// ─── Constants ────────────────────────────────────────────────────────────────

export const REPORT_REASONS = Object.freeze({
    SPAM:         'spam',
    HARASSMENT:   'harassment',
    INAPPROPRIATE:'inappropriate',
    MISINFORMATION:'misinformation',
    HATE_SPEECH:  'hate_speech',
    OTHER:        'other',
});

export const REPORT_REASON_LABELS = {
    [REPORT_REASONS.SPAM]:           'Spam or misleading',
    [REPORT_REASONS.HARASSMENT]:     'Harassment or bullying',
    [REPORT_REASONS.INAPPROPRIATE]:  'Inappropriate content',
    [REPORT_REASONS.MISINFORMATION]: 'Misinformation',
    [REPORT_REASONS.HATE_SPEECH]:    'Hate speech',
    [REPORT_REASONS.OTHER]:          'Other',
};

export const REPORT_STATUS = Object.freeze({
    PENDING:   'pending',
    RESOLVED:  'resolved',
    DISMISSED: 'dismissed',
});

export const REPORT_ACTION = Object.freeze({
    NONE:    'none',
    DELETED: 'deleted',
    WARNED:  'warned',
});

// ─── API ──────────────────────────────────────────────────────────────────────

export const moderationApi = {
    /**
     * Submit a report from a regular user.
     */
    submitReport: async ({ type, targetId, targetTitle, targetContent, targetAuthorId, reason, details, reportedBy, reporterEmail }) => {
        const report = {
            type,
            targetId,
            targetTitle:    targetTitle   || '',
            targetContent:  targetContent || '',
            targetAuthorId: targetAuthorId || '',
            reason,
            details:     details || '',
            reportedBy,
            reporterEmail,
            status:      REPORT_STATUS.PENDING,
            action:      REPORT_ACTION.NONE,
            createdAt:   new Date().toISOString(),
            resolvedAt:  null,
            resolvedBy:  null,
        };
        return createDocument('reports', report);
    },

    /**
     * Fetch all reports — optionally filter by status.
     */
    getReports: async (status = null) => {
        const constraints = [createQueryConstraint.orderBy('createdAt', 'desc')];
        if (status) constraints.unshift(createQueryConstraint.where('status', '==', status));
        return getCollection('reports', constraints);
    },

    /**
     * Fetch all reports targeting a specific post.
     */
    getReportsForTarget: async (targetId) => {
        return getCollection('reports', [
            createQueryConstraint.where('targetId', '==', targetId),
            createQueryConstraint.orderBy('createdAt', 'desc'),
        ]);
    },

    /**
     * Resolve a report — update status + action.
     */
    resolveReport: async (reportId, { action, resolvedBy }) => {
        return updateDocument('reports', reportId, {
            status:     REPORT_STATUS.RESOLVED,
            action:     action || REPORT_ACTION.NONE,
            resolvedAt: new Date().toISOString(),
            resolvedBy,
        });
    },

    /**
     * Dismiss a report (mark as not actionable).
     */
    dismissReport: async (reportId, resolvedBy) => {
        return updateDocument('reports', reportId, {
            status:     REPORT_STATUS.DISMISSED,
            action:     REPORT_ACTION.NONE,
            resolvedAt: new Date().toISOString(),
            resolvedBy,
        });
    },

    /**
     * Delete a report document.
     */
    deleteReport: async (reportId) => {
        return deleteDocument('reports', reportId);
    },
};
