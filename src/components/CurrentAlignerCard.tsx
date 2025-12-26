// Current Aligner Card Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';
import useAlignerSchedule from '../hooks/useAlignerSchedule';

export function CurrentAlignerCard() {
    const {
        currentAligner,
        currentAlignerNumber,
        daysRemaining,
        formattedChangeDate,
        totalAligners,
    } = useAlignerSchedule();

    if (!currentAligner) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No hay datos de tratamiento</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="medical" size={24} color={colors.primary} />
                <Text style={styles.label}>ALINEADOR ACTUAL</Text>
            </View>

            <View style={styles.alignerInfo}>
                <Text style={styles.alignerNumber}>
                    #{currentAlignerNumber}
                </Text>
                <Text style={styles.alignerTotal}>
                    de {totalAligners}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.changeInfo}>
                <View style={styles.daysContainer}>
                    <Text style={[
                        styles.daysNumber,
                        daysRemaining <= 1 && styles.daysUrgent,
                    ]}>
                        {daysRemaining}
                    </Text>
                    <Text style={styles.daysLabel}>
                        {daysRemaining === 1 ? 'día' : 'días'} restantes
                    </Text>
                </View>

                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.changeDate}>
                        Cambio: {formattedChangeDate}
                    </Text>
                </View>
            </View>

            {daysRemaining === 0 && (
                <View style={styles.changeAlert}>
                    <Ionicons name="notifications" size={20} color={colors.warning} />
                    <Text style={styles.changeAlertText}>
                        ¡Hoy es día de cambio!
                    </Text>
                </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    label: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    alignerInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.sm,
    },
    alignerNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: colors.primary,
    },
    alignerTotal: {
        ...typography.h3,
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.md,
    },
    changeInfo: {
        gap: spacing.md,
    },
    daysContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.sm,
    },
    daysNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    daysUrgent: {
        color: colors.warning,
    },
    daysLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    changeDate: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    changeAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.backgroundLight,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.md,
    },
    changeAlertText: {
        ...typography.body,
        color: colors.warning,
        fontWeight: '600',
    },
    noDataText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        padding: spacing.lg,
    },
});

export default CurrentAlignerCard;
