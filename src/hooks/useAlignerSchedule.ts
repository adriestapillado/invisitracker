// Aligner Schedule Hook
import { useMemo, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import alignerCalculator from '../services/AlignerCalculator';
import { Aligner } from '../types';

export function useAlignerSchedule() {
    const { appState, dispatch } = useAppContext();

    // Get current aligner info
    const currentAlignerInfo = useMemo(() => {
        if (appState.alignerHistory.length === 0) {
            return { current: null, number: 0 };
        }
        return alignerCalculator.getCurrentAligner(appState.alignerHistory);
    }, [appState.alignerHistory]);

    // Get next aligner
    const nextAligner = useMemo(() => {
        if (!currentAlignerInfo.current) return null;
        return alignerCalculator.getNextAligner(
            currentAlignerInfo.number,
            appState.alignerHistory
        );
    }, [currentAlignerInfo, appState.alignerHistory]);

    // Days remaining in current aligner
    const daysRemaining = useMemo(() => {
        if (!currentAlignerInfo.current) return 0;
        return alignerCalculator.getDaysRemaining(currentAlignerInfo.current);
    }, [currentAlignerInfo]);

    // Progress percentage
    const progress = useMemo(() => {
        return alignerCalculator.getProgress(
            currentAlignerInfo.number,
            appState.treatmentConfig.totalAligners
        );
    }, [currentAlignerInfo.number, appState.treatmentConfig.totalAligners]);

    // Completed aligners count
    const completedCount = useMemo(() => {
        return appState.alignerHistory.filter(a => a.completed).length;
    }, [appState.alignerHistory]);

    // Format change date for display
    const formattedChangeDate = useMemo(() => {
        if (!currentAlignerInfo.current) return '';
        return alignerCalculator.formatChangeDate(currentAlignerInfo.current.changeDate);
    }, [currentAlignerInfo]);

    // Mark aligner as completed
    const markCompleted = useCallback((alignerNumber: number) => {
        dispatch({
            type: 'MARK_ALIGNER_COMPLETED',
            payload: { alignerNumber },
        });
    }, [dispatch]);

    // Generate new schedule
    const generateSchedule = useCallback((
        startDate: string,
        daysPerAligner: number,
        totalAligners: number
    ): Aligner[] => {
        return alignerCalculator.generateAlignerSchedule(startDate, daysPerAligner, totalAligners);
    }, []);

    return {
        currentAligner: currentAlignerInfo.current,
        currentAlignerNumber: currentAlignerInfo.number,
        nextAligner,
        daysRemaining,
        progress,
        completedCount,
        totalAligners: appState.treatmentConfig.totalAligners,
        formattedChangeDate,
        alignerHistory: appState.alignerHistory,
        markCompleted,
        generateSchedule,
    };
}

export default useAlignerSchedule;
