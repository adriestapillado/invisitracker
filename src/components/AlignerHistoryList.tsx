// Aligner History List Component
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';
import { Aligner } from '../types';
import alignerCalculator from '../services/AlignerCalculator';

interface AlignerHistoryListProps {
    aligners: Aligner[];
    onMarkCompleted?: (alignerNumber: number) => void;
}

function AlignerHistoryItem({
    aligner,
    isCurrent,
    onMarkCompleted
}: {
    aligner: Aligner;
    isCurrent: boolean;
    onMarkCompleted?: (alignerNumber: number) => void;
}) {
    const today = new Date();
    const startDate = new Date(aligner.startDate);
    const endDate = new Date(aligner.endDate);
    const isPending = startDate > today;
    const isInProgress = !aligner.completed && !isPending && today <= endDate;

    const getStatusIcon = () => {
        if (aligner.completed) return 'checkmark-circle';
        if (isInProgress) return 'time';
        return 'ellipse-outline';
    };

    const getStatusColor = () => {
        if (aligner.completed) return colors.completed;
        if (isInProgress) return colors.inProgress;
        return colors.pending;
    };

    const formatDateRange = () => {
        const start = new Date(aligner.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const end = new Date(aligner.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        return `${start} - ${end}`;
    };

    return (
        <TouchableOpacity
            style={[styles.item, isCurrent && styles.itemCurrent]}
            onPress={() => !aligner.completed && onMarkCompleted?.(aligner.alignerNumber)}
            disabled={aligner.completed}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <Ionicons
                    name={getStatusIcon()}
                    size={24}
                    color={getStatusColor()}
                />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemNumber}>
                        Alineador #{aligner.alignerNumber}
                    </Text>
                    <Text style={styles.itemDate}>{formatDateRange()}</Text>
                </View>
            </View>

            <View style={styles.itemRight}>
                {aligner.completed && (
                    <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>Completado</Text>
                    </View>
                )}
                {isInProgress && (
                    <View style={styles.inProgressBadge}>
                        <Text style={styles.inProgressText}>En progreso</Text>
                    </View>
                )}
                {isPending && (
                    <View style={styles.pendingBadge}>
                        <Text style={styles.pendingText}>Pendiente</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

export function AlignerHistoryList({ aligners, onMarkCompleted }: AlignerHistoryListProps) {
    const { number: currentNumber } = alignerCalculator.getCurrentAligner(aligners);

    if (aligners.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptyText}>No hay historial de alineadores</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={aligners}
            keyExtractor={(item) => `aligner-${item.alignerNumber}`}
            renderItem={({ item }) => (
                <AlignerHistoryItem
                    aligner={item}
                    isCurrent={item.alignerNumber === currentNumber}
                    onMarkCompleted={onMarkCompleted}
                />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={15}
            maxToRenderPerBatch={15}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: spacing.xxl,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    itemCurrent: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    itemInfo: {
        gap: spacing.xs,
    },
    itemNumber: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    itemDate: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    completedBadge: {
        backgroundColor: colors.completed,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    completedText: {
        ...typography.caption,
        color: colors.background,
        fontWeight: '600',
    },
    inProgressBadge: {
        backgroundColor: colors.inProgress,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    inProgressText: {
        ...typography.caption,
        color: colors.background,
        fontWeight: '600',
    },
    pendingBadge: {
        backgroundColor: colors.pending,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    pendingText: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xxl,
        gap: spacing.md,
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
    },
});

export default AlignerHistoryList;
