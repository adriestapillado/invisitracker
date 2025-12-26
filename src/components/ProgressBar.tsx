// Progress Bar Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';
import useAlignerSchedule from '../hooks/useAlignerSchedule';

export function ProgressBar() {
    const { progress, completedCount, currentAlignerNumber, totalAligners } = useAlignerSchedule();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Progreso del tratamiento</Text>
                <Text style={styles.stats}>
                    {currentAlignerNumber}/{totalAligners}
                </Text>
            </View>

            <View style={styles.progressBar}>
                <View
                    style={[styles.progressFill, { width: `${progress}%` }]}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.percentage}>{progress}%</Text>
                <Text style={styles.completedText}>
                    {completedCount} completados
                </Text>
            </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    label: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    stats: {
        ...typography.h3,
        color: colors.primary,
    },
    progressBar: {
        height: 12,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.round,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.round,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
    },
    percentage: {
        ...typography.bodySmall,
        color: colors.primary,
        fontWeight: '600',
    },
    completedText: {
        ...typography.caption,
        color: colors.textSecondary,
    },
});

export default ProgressBar;
