import * as React from 'react';
import { createContext, useReducer, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState as RNAppState } from 'react-native';
import { AppState, AppAction } from '../types';
import { getInitialAppState, formatDate, APP_VERSION } from '../constants/config';
import storageService from '../services/StorageService';
import alignerCalculator from '../services/AlignerCalculator';

// Initial state
const initialState = getInitialAppState();

// Reducer function
export function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'INITIALIZE_APP':
            return action.payload;

        case 'START_SETUP':
            return {
                ...state,
                treatmentConfig: {
                    treatmentStartDate: action.payload.startDate,
                    daysPerAligner: action.payload.daysPerAligner,
                    totalAligners: action.payload.totalAligners,
                    isConfigured: true,
                },
                alignerHistory: action.payload.alignerHistory,
                currentAlignerNumber: 1,
                currentAlignerStartDate: action.payload.startDate,
                nextChangeDate: action.payload.alignerHistory[0]?.changeDate || '',
                nextAlignerNumber: 2,
                lastUpdated: new Date().toISOString(),
            };

        case 'START_TIMER':
            return {
                ...state,
                todayTimer: {
                    ...state.todayTimer,
                    isRunning: true,
                    lastStartTime: Date.now(),
                },
            };

        case 'PAUSE_TIMER':
            return {
                ...state,
                todayTimer: {
                    ...state.todayTimer,
                    isRunning: false,
                    lastStartTime: undefined,
                },
            };

        case 'INCREMENT_TIMER':
            return {
                ...state,
                todayTimer: {
                    ...state.todayTimer,
                    secondsToday: state.todayTimer.secondsToday + action.payload.seconds,
                },
            };

        case 'RESET_TIMER':
            return {
                ...state,
                todayTimer: {
                    date: action.payload?.date || formatDate(new Date()),
                    secondsToday: 0,
                    isRunning: false,
                    lastStartTime: undefined,
                },
            };

        case 'RESET_TIMER_TODAY':
            return {
                ...state,
                todayTimer: {
                    ...state.todayTimer,
                    secondsToday: 0,
                    isRunning: false,
                    lastStartTime: undefined,
                },
            };

        case 'SAVE_DAILY_USAGE':
            return {
                ...state,
                dailyUsageHistory: [
                    ...state.dailyUsageHistory,
                    {
                        date: action.payload.date,
                        secondsWithoutAligner: action.payload.seconds,
                        alignerNumber: action.payload.alignerNumber,
                    },
                ],
            };

        case 'MARK_ALIGNER_COMPLETED':
            return {
                ...state,
                alignerHistory: state.alignerHistory.map(a =>
                    a.alignerNumber === action.payload.alignerNumber
                        ? { ...a, completed: true }
                        : a
                ),
            };

        case 'UNMARK_ALIGNER_COMPLETED':
            return {
                ...state,
                alignerHistory: state.alignerHistory.map(a =>
                    a.alignerNumber === action.payload.alignerNumber
                        ? { ...a, completed: false }
                        : a
                ),
            };

        case 'UPDATE_ALIGNER_SCHEDULE':
            return {
                ...state,
                alignerHistory: alignerCalculator.recalculateScheduleFromAligner(
                    state.alignerHistory,
                    action.payload.alignerNumber,
                    action.payload.newEndDate,
                    action.payload.daysPerAligner
                ),
                lastUpdated: new Date().toISOString(),
            };

        case 'UPDATE_CURRENT_ALIGNER':
            return {
                ...state,
                currentAlignerNumber: action.payload.alignerNumber,
                currentAlignerStartDate: action.payload.startDate,
                nextChangeDate: action.payload.nextChangeDate,
                nextAlignerNumber: action.payload.nextAlignerNumber,
            };

        case 'RESET_ALL_DATA':
            return getInitialAppState();

        case 'TOGGLE_NOTIFICATIONS':
            return {
                ...state,
                notificationsEnabled: action.payload.enabled,
            };

        case 'SYNC_BACKGROUND_TIME':
            return {
                ...state,
                todayTimer: {
                    ...state.todayTimer,
                    secondsToday: state.todayTimer.secondsToday + action.payload.elapsedSeconds,
                    lastStartTime: Date.now(),
                },
            };

        case 'SET_TIMER_START':
            return {
                ...state,
                todayTimer: {
                    ...state.todayTimer,
                    lastStartTime: action.payload.lastStartTime,
                },
            };

        default:
            return state;
    }
}

// Context type
interface AppContextType {
    appState: AppState;
    dispatch: React.Dispatch<AppAction>;
    isLoading: boolean;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appState, dispatch] = useReducer(appReducer, initialState);
    const [isLoading, setIsLoading] = useState(true);

    // Load state from storage on mount
    useEffect(() => {
        const loadInitialState = async () => {
            try {
                const saved = await storageService.loadState();
                console.log('Loaded state:', saved ? 'Found' : 'Not found');

                if (saved && saved.treatmentConfig.isConfigured) {
                    // Check if day has changed and reset timer if needed
                    const today = formatDate(new Date());
                    if (saved.todayTimer.date !== today) {
                        // Save yesterday's usage before resetting
                        if (saved.todayTimer.secondsToday > 0) {
                            const yesterdayAligner = saved.currentAlignerNumber || 1;
                            saved.dailyUsageHistory = [
                                ...(saved.dailyUsageHistory || []),
                                {
                                    date: saved.todayTimer.date,
                                    secondsWithoutAligner: saved.todayTimer.secondsToday,
                                    alignerNumber: yesterdayAligner,
                                },
                            ];
                        }
                        saved.todayTimer = {
                            date: today,
                            secondsToday: 0,
                            isRunning: false,
                            lastStartTime: undefined,
                        };
                    } else if (saved.todayTimer.isRunning && saved.todayTimer.lastStartTime) {
                        // Sync background time if same day and running
                        const elapsed = Math.floor((Date.now() - saved.todayTimer.lastStartTime) / 1000);
                        if (elapsed > 0) {
                            saved.todayTimer.secondsToday += elapsed;
                            saved.todayTimer.lastStartTime = Date.now();
                        }
                    }
                    dispatch({ type: 'INITIALIZE_APP', payload: saved });
                }
            } catch (error) {
                console.error('Error loading state:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialState();

        // Listen for app state changes (resume from background)
        const subscription = RNAppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                console.log('App resumed, syncing state...');
                loadInitialState();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Save state to storage on changes
    useEffect(() => {
        if (!isLoading && appState.treatmentConfig.isConfigured) {
            storageService.saveState(appState);
        }
    }, [appState, isLoading]);

    return (
        <AppContext.Provider value={{ appState, dispatch, isLoading }}>
            {children}
        </AppContext.Provider>
    );
}

// Hook to use app context
export function useAppContext(): AppContextType {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export default AppContext;

