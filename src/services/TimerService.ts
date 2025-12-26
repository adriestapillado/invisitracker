// Timer Service - Daily timer logic
import { AppState } from '../types';
import { formatDate } from '../constants/config';

class TimerService {
    /**
     * Get seconds elapsed today
     * Detects if day has changed and returns 0 for new day
     */
    getTodaySeconds(lastSavedState: AppState): number {
        const today = formatDate(new Date());

        if (lastSavedState.todayTimer.date !== today) {
            // Day changed, reset to 0
            return 0;
        }
        return lastSavedState.todayTimer.secondsToday;
    }

    /**
     * Add seconds to timer
     */
    addSeconds(currentSeconds: number, delta: number): number {
        return currentSeconds + delta;
    }

    /**
     * Convert seconds to "Xh Ym" format
     */
    formatSeconds(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    }

    /**
     * Format seconds to full display "Xh Ym Zs"
     */
    formatSecondsFull(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }

    /**
     * Check if timer should reset (day change)
     */
    shouldResetTimer(lastDate: string, today: string): boolean {
        return lastDate !== today;
    }

    /**
     * Get hours from seconds
     */
    getHours(seconds: number): number {
        return Math.floor(seconds / 3600);
    }

    /**
     * Check if goal reached (e.g., 22 hours)
     */
    isGoalReached(seconds: number, goalHours: number = 22): boolean {
        return this.getHours(seconds) >= goalHours;
    }

    /**
     * Get progress percentage towards daily goal
     */
    getDailyProgress(seconds: number, goalHours: number = 22): number {
        const goalSeconds = goalHours * 3600;
        return Math.min(100, Math.round((seconds / goalSeconds) * 100));
    }
}

export const timerService = new TimerService();
export default timerService;
