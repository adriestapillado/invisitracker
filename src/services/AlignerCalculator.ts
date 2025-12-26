// Aligner Calculator Service
import { Aligner } from '../types';
import { formatDate, parseDate, NOTIFICATION_HOUR, NOTIFICATION_MINUTE } from '../constants/config';

class AlignerCalculator {
    /**
     * Generate complete aligner schedule
     * @param startDate Treatment start date "2025-01-15"
     * @param daysPerAligner Days per aligner (e.g., 14)
     * @param totalAligners Total number of aligners
     * @returns Array of Aligner objects
     */
    generateAlignerSchedule(
        startDate: string,
        daysPerAligner: number,
        totalAligners: number
    ): Aligner[] {
        const aligners: Aligner[] = [];
        let currentStart = parseDate(startDate);

        for (let i = 1; i <= totalAligners; i++) {
            // endDate = startDate + (daysPerAligner - 1) days
            const endDate = new Date(currentStart);
            endDate.setDate(endDate.getDate() + daysPerAligner - 1);

            // Change notification at 07:00 on the end date
            const changeDateTime = new Date(endDate);
            changeDateTime.setHours(NOTIFICATION_HOUR, NOTIFICATION_MINUTE, 0, 0);

            aligners.push({
                alignerNumber: i,
                startDate: formatDate(currentStart),
                endDate: formatDate(endDate),
                changeDate: changeDateTime.toISOString(),
                completed: false,
                notificationScheduled: false,
            });

            // Next aligner starts the day after
            currentStart = new Date(endDate);
            currentStart.setDate(currentStart.getDate() + 1);
        }

        return aligners;
    }

    /**
     * Get current aligner based on today's date
     */
    getCurrentAligner(
        schedule: Aligner[],
        today: Date = new Date()
    ): { current: Aligner | null; number: number } {
        const todayStr = formatDate(today);

        for (const aligner of schedule) {
            // Check if today is within the aligner's date range
            if (todayStr >= aligner.startDate && todayStr <= aligner.endDate) {
                return { current: aligner, number: aligner.alignerNumber };
            }
        }

        // If today is before treatment starts
        if (schedule.length > 0 && todayStr < schedule[0].startDate) {
            return { current: schedule[0], number: 1 };
        }

        // If today is after treatment ends
        if (schedule.length > 0) {
            const lastAligner = schedule[schedule.length - 1];
            if (todayStr > lastAligner.endDate) {
                return { current: lastAligner, number: lastAligner.alignerNumber };
            }
        }

        return { current: null, number: 0 };
    }

    /**
     * Get the next aligner in the sequence
     */
    getNextAligner(currentNumber: number, schedule: Aligner[]): Aligner | null {
        const nextIndex = schedule.findIndex(a => a.alignerNumber === currentNumber + 1);
        return nextIndex >= 0 ? schedule[nextIndex] : null;
    }

    /**
     * Calculate days remaining until aligner change
     */
    getDaysRemaining(aligner: Aligner, today: Date = new Date()): number {
        const endDate = parseDate(aligner.endDate);
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const diffTime = endDate.getTime() - todayStart.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    /**
     * Get progress percentage
     */
    getProgress(currentNumber: number, totalAligners: number): number {
        if (totalAligners === 0) return 0;
        return Math.round(((currentNumber - 1) / totalAligners) * 100);
    }

    /**
     * Format change date for display
     */
    formatChangeDate(changeDate: string, locale: string = 'es-ES'): string {
        const date = new Date(changeDate);
        return date.toLocaleDateString(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
}

export const alignerCalculator = new AlignerCalculator();
export default alignerCalculator;
