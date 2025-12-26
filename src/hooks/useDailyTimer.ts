// Daily Timer Hook
import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import timerService from '../services/TimerService';
import { formatDate, TIMER_INTERVAL, DATE_CHECK_INTERVAL } from '../constants/config';

export function useDailyTimer() {
    const { appState, dispatch } = useAppContext();
    const [displayTime, setDisplayTime] = useState<string>('0h 00m');
    const [displayTimeFull, setDisplayTimeFull] = useState<string>('0h 00m 00s');

    // Detect day change and reset timer
    useEffect(() => {
        const checkAndResetTimer = () => {
            const today = formatDate(new Date());
            if (appState.todayTimer.date !== today) {
                console.log('Day changed, resetting timer');
                dispatch({
                    type: 'RESET_TIMER',
                    payload: { date: today },
                });
            }
        };

        checkAndResetTimer();
        const interval = setInterval(checkAndResetTimer, DATE_CHECK_INTERVAL);
        return () => clearInterval(interval);
    }, [appState.todayTimer.date, dispatch]);

    // Update every second if running
    useEffect(() => {
        if (!appState.todayTimer.isRunning) return;

        const interval = setInterval(() => {
            dispatch({ type: 'INCREMENT_TIMER', payload: { seconds: 1 } });
        }, TIMER_INTERVAL);

        return () => clearInterval(interval);
    }, [appState.todayTimer.isRunning, dispatch]);

    // Update display time
    useEffect(() => {
        setDisplayTime(timerService.formatSeconds(appState.todayTimer.secondsToday));
        setDisplayTimeFull(timerService.formatSecondsFull(appState.todayTimer.secondsToday));
    }, [appState.todayTimer.secondsToday]);

    const startTimer = useCallback(() => {
        dispatch({ type: 'START_TIMER' });
    }, [dispatch]);

    const pauseTimer = useCallback(() => {
        dispatch({ type: 'PAUSE_TIMER' });
    }, [dispatch]);

    const resetTimer = useCallback(() => {
        dispatch({ type: 'RESET_TIMER_TODAY' });
    }, [dispatch]);

    const toggleTimer = useCallback(() => {
        if (appState.todayTimer.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }, [appState.todayTimer.isRunning, startTimer, pauseTimer]);

    return {
        displayTime,
        displayTimeFull,
        isRunning: appState.todayTimer.isRunning,
        seconds: appState.todayTimer.secondsToday,
        startTimer,
        pauseTimer,
        resetTimer,
        toggleTimer,
        dailyProgress: timerService.getDailyProgress(appState.todayTimer.secondsToday),
        isGoalReached: timerService.isGoalReached(appState.todayTimer.secondsToday),
    };
}

export default useDailyTimer;
