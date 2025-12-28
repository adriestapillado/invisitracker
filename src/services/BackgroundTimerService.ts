import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import storageService from './StorageService';

const BACKGROUND_TASK = 'background-timer-task';

TaskManager.defineTask(BACKGROUND_TASK, async () => {
    try {
        const state = await storageService.loadState();
        if (!state?.todayTimer.isRunning) return BackgroundFetch.BackgroundFetchResult.NoData;

        const now = Date.now();
        const lastStart = state.todayTimer.lastStartTime || now;
        const elapsedSeconds = Math.floor((now - lastStart) / 1000);

        // Sumar tiempo transcurrido al total de hoy
        const newSeconds = state.todayTimer.secondsToday + elapsedSeconds;

        // Actualizar estado
        state.todayTimer.secondsToday = newSeconds;
        state.todayTimer.lastStartTime = now;

        // Ensure date is updated to avoid mismatch if day changed in background
        // However, StorageService/TimerService logic might handle this better. 
        // For now, follow user logic: just update seconds and startTime.

        await storageService.saveState(state);

        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error('Background task failed:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export class BackgroundTimerService {
    static async enable() {
        try {
            const status = await BackgroundFetch.getStatusAsync();
            if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
                await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
                    minimumInterval: 60, // Cada minuto mínimo
                    stopOnTerminate: false,
                    startOnBoot: true,
                });
                console.log('Background timer enabled');
            } else {
                console.log('Background fetch not available');
            }
        } catch (error) {
            console.error('Error enabling background timer:', error);
        }
    }

    static async disable() {
        try {
            await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK);
            console.log('Background timer disabled');
        } catch (error) {
            console.error('Error disabling background timer:', error);
        }
    }
}

export default BackgroundTimerService;
