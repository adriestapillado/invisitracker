// History Screen - Aligner history list
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import typography from '../styles/typography';
import AlignerHistoryList from '../components/AlignerHistoryList';
import useAlignerSchedule from '../hooks/useAlignerSchedule';

export function HistoryScreen() {
    const { alignerHistory, completedCount, totalAligners, markCompleted } = useAlignerSchedule();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <Text style={styles.title}>📜 Historial</Text>
                <Text style={styles.stats}>
                    {completedCount} de {totalAligners} completados
                </Text>
            </View>

            <View style={styles.listContainer}>
                <AlignerHistoryList
                    aligners={alignerHistory}
                    onMarkCompleted={markCompleted}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Toca un alineador para marcarlo como completado
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.lg,
        paddingTop: spacing.xl,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
    },
    stats: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    footer: {
        padding: spacing.md,
        alignItems: 'center',
    },
    footerText: {
        ...typography.caption,
        color: colors.textMuted,
    },
});

export default HistoryScreen;
