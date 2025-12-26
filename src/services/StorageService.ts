// Storage Service - AsyncStorage abstraction
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';
import { STORAGE_KEY, formatDate } from '../constants/config';

class StorageService {
    /**
     * Load complete state from storage
     */
    async loadState(): Promise<AppState | null> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                console.log('Loaded state from storage');
                return parsed;
            }
            return null;
        } catch (error) {
            console.error('Error loading state:', error);
            return null;
        }
    }

    /**
     * Save complete state
     */
    async saveState(state: AppState): Promise<void> {
        try {
            const stateToSave = {
                ...state,
                lastUpdated: new Date().toISOString(),
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    /**
     * Delete all data (reset)
     */
    async clearStorage(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            console.log('Storage cleared');
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    /**
     * Update only today's timer
     */
    async updateTodayTimer(seconds: number, isRunning: boolean): Promise<void> {
        const currentState = await this.loadState();
        if (currentState) {
            currentState.todayTimer.secondsToday = seconds;
            currentState.todayTimer.isRunning = isRunning;
            currentState.todayTimer.date = formatDate(new Date());
            await this.saveState(currentState);
        }
    }
}

export const storageService = new StorageService();
export default storageService;
