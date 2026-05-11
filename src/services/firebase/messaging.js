import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';
import { updateDocument } from './firestore';

/**
 * Requests permission for push notifications and returns the FCM token.
 * If permission is granted, the token is saved to the user's Firestore document.
 * 
 * @param {string} userUid - The UID of the current user.
 */
export const requestNotificationPermission = async (userUid) => {
    try {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            
            // Generate FCM Token
            // The VAPID key is required for some browsers. You can generate one in the Firebase Console.
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY 
            });
            
            if (token) {
                // Save token to user document
                await updateDocument('users', userUid, {
                    fcmToken: token,
                    notificationsEnabled: true,
                    updatedAt: new Date().toISOString()
                });
                
                return token;
            } else {
                console.warn('No registration token available. Request permission to generate one.');
            }
        } else {
            console.warn('Notification permission denied.');
            return null;
        }
    } catch (error) {
        console.error('An error occurred while requesting permission:', error);
        return null;
    }
};

/**
 * Listens for incoming messages while the app is in the foreground.
 * 
 * @param {Function} callback - Function to handle the notification payload.
 */
export const onForegroundMessage = (callback) => {
    return onMessage(messaging, (payload) => {
        if (callback) callback(payload);
    });
};
