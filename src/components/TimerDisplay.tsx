// Timer Display Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';
import useDailyTimer from '../hooks/useDailyTimer';

export function TimerDisplay() {
    const {
        displayTimeFull,
        isRunning,
        toggleTimer,
        resetTimer,
        dailyProgress,
        isGoalReached,
    } = useDailyTimer();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>⏱️ TIEMPO HOY</Text>

            <View style={styles.timerContainer}>
                <Text style={[
                    styles.timerText,
                    isRunning && styles.timerRunning,
                    isGoalReached && styles.timerGoalReached,
                ]}>
                    {displayTimeFull}
                </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${dailyProgress}%` },
                            isGoalReached && styles.progressGoalReached,
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {dailyProgress}% de 22h
                </Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.button, isRunning ? styles.buttonPause : styles.buttonStart]}
                    onPress={toggleTimer}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isRunning ? 'pause' : 'play'}
                        size={24}
                        color={colors.textPrimary}
                    />
                    <Text style={styles.buttonText}>
                        {isRunning ? 'Pausar' : 'Iniciar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buttonReset]}
                    onPress={resetTimer}
                    activeOpacity={0.8}
                >
                    <Ionicons name='refresh' size={24} color={colors.textPrimary} />
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            {isGoalReached && (
                <Text style={styles.goalMessage}>
                    🎉 ¡Meta diaria alcanzada!
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    timerContainer: {
        alignItems: 'center',
        marginVertical: spacing.md,
    },
    timerText: {
        ...typography.timer,
        color: colors.timerStopped,
    },
    timerRunning: {
        color: colors.timerActive,
    },
    timerGoalReached: {
        color: colors.success,
    },
    progressContainer: {
        marginVertical: spacing.md,
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.round,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.round,
    },
    progressGoalReached: {
        backgroundColor: colors.success,
    },
    progressText: {
        ...typography.caption,
        color: colors.textSecondary,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    buttonStart: {
        backgroundColor: colors.success,
    },
    buttonPause: {
        backgroundColor: colors.warning,
    },
    buttonReset: {
        backgroundColor: colors.buttonSecondary,
    },
    buttonText: {
        ...typography.button,
        color: colors.textPrimary,
    },
    goalMessage: {
        ...typography.body,
        color: colors.success,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});

export default TimerDisplay;
