/**
 * notificationsApi — Placeholder for in-app notification state.
 *
 * NOTE: Real push notifications are handled by Firebase Cloud Messaging
 * (see src/services/firebase/messaging.js).
 * This API manages any in-app bell-icon state / read-receipts if needed in future.
 */
export const notificationsApi = {
    getAll: async () => {
        // Future: query a 'notifications' collection scoped to the current user
        return [];
    }
};
