// Notification Service - Push notification handling
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Aligner } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

class NotificationService {
    /**
     * Request notification permissions
     */
    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'web') {
            // Web notifications limited
            return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Notification permissions not granted');
            return false;
        }

        return true;
    }

    /**
     * Schedule notification for aligner change
     */
    async scheduleAlignerNotification(
        aligner: Aligner,
        nextAlignerNumber: number
    ): Promise<string | null> {
        if (Platform.OS === 'web') {
            console.log('Notifications not available on web');
            return null;
        }

        try {
            const changeDateTime = new Date(aligner.changeDate);

            // Don't schedule if date is in the past
            if (changeDateTime <= new Date()) {
                return null;
            }

            const identifier = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🦷 Cambio de alineador',
                    body: `¡Hoy cambias al alineador #${nextAlignerNumber}!`,
                    sound: 'default',
                    data: {
                        alignerNumber: aligner.alignerNumber,
                        nextAlignerNumber,
                    },
                },
                trigger: {
                    date: changeDateTime,
                },
            });

            console.log(`Scheduled notification for aligner #${aligner.alignerNumber} at ${changeDateTime}`);
            return identifier;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            return null;
        }
    }

    /**
     * Cancel all scheduled notifications
     */
    async cancelAllNotifications(): Promise<void> {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            console.log('All notifications cancelled');
        } catch (error) {
            console.error('Error cancelling notifications:', error);
        }
    }

    /**
     * Reschedule pending notifications for all future aligners
     */
    async reschedulePendingNotifications(
        alignerHistory: Aligner[],
        today: Date = new Date()
    ): Promise<void> {
        // Cancel existing first
        await this.cancelAllNotifications();

        for (const aligner of alignerHistory) {
            const changeDate = new Date(aligner.changeDate);

            // Only schedule if date is future and not completed
            if (changeDate > today && !aligner.completed) {
                const nextNumber = aligner.alignerNumber + 1;
                await this.scheduleAlignerNotification(aligner, nextNumber);
            }
        }
    }

    /**
     * Get all scheduled notifications
     */
    async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        try {
            return await Notifications.getAllScheduledNotificationsAsync();
        } catch (error) {
            console.error('Error getting scheduled notifications:', error);
            return [];
        }
    }

    /**
     * Add notification response listener
     */
    addNotificationResponseListener(
        callback: (response: Notifications.NotificationResponse) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }
}

export const notificationService = new NotificationService();
export default notificationService;
