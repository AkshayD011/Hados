/**
 * activityLog.api.js
 *
 * Firestore schema — admin_logs/{logId}
 *
 *   action      : string  (ACTION_TYPE value)
 *   category    : string  (CATEGORY value)
 *   adminUid    : string
 *   adminEmail  : string
 *   targetId    : string | null   (uid / postId / clubId / reportId)
 *   targetType  : string | null   ('user' | 'post' | 'club' | 'report')
 *   targetLabel : string | null   (human-readable snapshot)
 *   meta        : object          (extra key/value data)
 *   timestamp   : ISO string
 */
import {
    getCollection,
    createDocument,
    createQueryConstraint,
} from '../firebase/firestore';

// ─── Action types ─────────────────────────────────────────────────────────────

export const ACTION_TYPE = Object.freeze({
    // User management
    ROLE_CHANGED:      'role_changed',
    USER_SUSPENDED:    'user_suspended',
    USER_UNSUSPENDED:  'user_unsuspended',

    // Content moderation
    POST_DELETED:      'post_deleted',
    REPORT_RESOLVED:   'report_resolved',
    REPORT_DISMISSED:  'report_dismissed',

    // Club workflow
    CLUB_APPROVED:     'club_approved',
    CLUB_REJECTED:     'club_rejected',
    CLUB_DELETED:      'club_deleted',
});

// ─── Category map (for grouping / filtering) ──────────────────────────────────

export const CATEGORY = Object.freeze({
    USER:        'user',
    MODERATION:  'moderation',
    CLUB:        'club',
});

const ACTION_CATEGORY = {
    [ACTION_TYPE.ROLE_CHANGED]:     CATEGORY.USER,
    [ACTION_TYPE.USER_SUSPENDED]:   CATEGORY.USER,
    [ACTION_TYPE.USER_UNSUSPENDED]: CATEGORY.USER,
    [ACTION_TYPE.POST_DELETED]:     CATEGORY.MODERATION,
    [ACTION_TYPE.REPORT_RESOLVED]:  CATEGORY.MODERATION,
    [ACTION_TYPE.REPORT_DISMISSED]: CATEGORY.MODERATION,
    [ACTION_TYPE.CLUB_APPROVED]:    CATEGORY.CLUB,
    [ACTION_TYPE.CLUB_REJECTED]:    CATEGORY.CLUB,
    [ACTION_TYPE.CLUB_DELETED]:     CATEGORY.CLUB,
};

// ─── Human-readable labels ────────────────────────────────────────────────────

export const ACTION_LABEL = {
    [ACTION_TYPE.ROLE_CHANGED]:     'Role changed',
    [ACTION_TYPE.USER_SUSPENDED]:   'User suspended',
    [ACTION_TYPE.USER_UNSUSPENDED]: 'User unsuspended',
    [ACTION_TYPE.POST_DELETED]:     'Post deleted',
    [ACTION_TYPE.REPORT_RESOLVED]:  'Report resolved',
    [ACTION_TYPE.REPORT_DISMISSED]: 'Report dismissed',
    [ACTION_TYPE.CLUB_APPROVED]:    'Club approved',
    [ACTION_TYPE.CLUB_REJECTED]:    'Club rejected',
    [ACTION_TYPE.CLUB_DELETED]:     'Club deleted',
};

// ─── API ──────────────────────────────────────────────────────────────────────

export const activityLogApi = {
    /**
     * Write a single log entry. Fire-and-forget safe — errors are caught
     * and only warned, so a log failure never breaks the calling action.
     *
     * @param {object} admin       — { uid, email } of the acting admin
     * @param {string} action      — ACTION_TYPE value
     * @param {object} [target]    — { id, type, label }
     * @param {object} [meta]      — any extra data to store
     */
    log: async (admin, action, target = {}, meta = {}) => {
        try {
            await createDocument('admin_logs', {
                action,
                category:    ACTION_CATEGORY[action] ?? 'other',
                adminUid:    admin.uid   ?? null,
                adminEmail:  admin.email ?? null,
                targetId:    target.id    ?? null,
                targetType:  target.type  ?? null,
                targetLabel: target.label ?? null,
                meta,
                timestamp:   new Date().toISOString(),
            });
        } catch (err) {
            console.warn('[ActivityLog] Failed to write log entry:', err);
        }
    },

    /**
     * Fetch recent log entries, optionally filtered by category.
     * Always sorted newest-first.
     *
     * @param {object} opts
     * @param {string|null} opts.category — CATEGORY value, or null for all
     * @param {number}      opts.limit    — max entries to return (default 100)
     */
    getLogs: async ({ category = null, limit = 100 } = {}) => {
        const constraints = [createQueryConstraint.orderBy('timestamp', 'desc')];
        if (category) constraints.unshift(createQueryConstraint.where('category', '==', category));
        const all = await getCollection('admin_logs', constraints);
        return all.slice(0, limit);
    },
};
