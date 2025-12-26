// Types for Invisalign Tracker App

export interface TreatmentConfig {
    treatmentStartDate: string;  // "2025-01-15" (ISO 8601)
    daysPerAligner: number;      // 14
    totalAligners: number;       // 20
    isConfigured: boolean;       // true/false
}

export interface TodayTimer {
    date: string;                // "2025-12-25" (YYYY-MM-DD)
    secondsToday: number;        // Accumulated seconds today
    isRunning: boolean;          // Timer running state
    lastStartTime?: number;      // Timestamp when started
}

export interface Aligner {
    alignerNumber: number;       // 1-20
    startDate: string;           // "2025-01-15" (YYYY-MM-DD)
    endDate: string;             // "2025-01-29" (YYYY-MM-DD)
    changeDate: string;          // "2025-01-29T07:00:00Z" (ISO)
    completed: boolean;          // true/false
    notificationScheduled?: boolean;
    hoursWorn?: number;          // Optional tracking
}

export interface AppState {
    // Treatment configuration
    treatmentConfig: TreatmentConfig;

    // Current day timer
    todayTimer: TodayTimer;

    // Aligner history
    alignerHistory: Aligner[];

    // Current aligner
    currentAlignerNumber: number;
    currentAlignerStartDate: string;

    // Next change info
    nextChangeDate: string;
    nextAlignerNumber: number;

    // Settings
    notificationsEnabled: boolean;

    // Metadata
    lastUpdated: string;
    appVersion: string;
}

export type AppAction =
    | { type: 'INITIALIZE_APP'; payload: AppState }
    | { type: 'START_SETUP'; payload: { startDate: string; daysPerAligner: number; totalAligners: number; alignerHistory: Aligner[] } }
    | { type: 'START_TIMER' }
    | { type: 'PAUSE_TIMER' }
    | { type: 'INCREMENT_TIMER'; payload: { seconds: number } }
    | { type: 'RESET_TIMER'; payload?: { date: string } }
    | { type: 'RESET_TIMER_TODAY' }
    | { type: 'MARK_ALIGNER_COMPLETED'; payload: { alignerNumber: number } }
    | { type: 'UPDATE_CURRENT_ALIGNER'; payload: { alignerNumber: number; startDate: string; nextChangeDate: string; nextAlignerNumber: number } }
    | { type: 'RESET_ALL_DATA' }
    | { type: 'TOGGLE_NOTIFICATIONS'; payload: { enabled: boolean } };

export type Screen = 'setup' | 'home' | 'history' | 'settings';
