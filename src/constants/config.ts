// Configuration constants for Invisalign Tracker

export const STORAGE_KEY = 'INVISALIGN_TRACKER_DATA';

export const DEFAULT_DAYS_PER_ALIGNER = 14;
export const DEFAULT_TOTAL_ALIGNERS = 20;

export const NOTIFICATION_HOUR = 7;  // 07:00 AM
export const NOTIFICATION_MINUTE = 0;

export const APP_VERSION = '1.0.0';

// Timer check interval (ms)
export const TIMER_INTERVAL = 1000;
export const DATE_CHECK_INTERVAL = 60000; // Check every minute for day change

// Default initial state
export const getInitialAppState = () => ({
    treatmentConfig: {
        treatmentStartDate: '',
        daysPerAligner: DEFAULT_DAYS_PER_ALIGNER,
        totalAligners: DEFAULT_TOTAL_ALIGNERS,
        isConfigured: false,
    },
    todayTimer: {
        date: formatDate(new Date()),
        secondsToday: 0,
        isRunning: false,
        lastStartTime: undefined,
    },
    alignerHistory: [],
    currentAlignerNumber: 1,
    currentAlignerStartDate: '',
    nextChangeDate: '',
    nextAlignerNumber: 2,
    notificationsEnabled: true,
    lastUpdated: new Date().toISOString(),
    appVersion: APP_VERSION,
});

// Date formatting helper
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Parse date string to Date object
export function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}
