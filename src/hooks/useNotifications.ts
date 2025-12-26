// Notifications Hook
import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import notificationService from '../services/NotificationService';
import { useAppContext } from '../context/AppContext';

export function useNotifications() {
    const { appState, dispatch } = useAppContext();
    const [hasPermission, setHasPermission] = useState(false);

    // Request permissions on mount
    useEffect(() => {
        const requestPerms = async () => {
            if (Platform.OS !== 'web') {
                const granted = await notificationService.requestPermissions();
                setHasPermission(granted);
            }
        };
        requestPerms();
    }, []);

    // Reschedule notifications when aligners change
    useEffect(() => {
        if (appState.notificationsEnabled && appState.alignerHistory.length > 0) {
            notificationService.reschedulePendingNotifications(appState.alignerHistory);
        }
    }, [appState.alignerHistory, appState.notificationsEnabled]);

    // Toggle notifications
    const toggleNotifications = useCallback((enabled: boolean) => {
        dispatch({ type: 'TOGGLE_NOTIFICATIONS', payload: { enabled } });

        if (!enabled) {
            notificationService.cancelAllNotifications();
        } else if (appState.alignerHistory.length > 0) {
            notificationService.reschedulePendingNotifications(appState.alignerHistory);
        }
    }, [dispatch, appState.alignerHistory]);

    return {
        hasPermission,
        notificationsEnabled: appState.notificationsEnabled,
        toggleNotifications,
    };
}

export default useNotifications;
