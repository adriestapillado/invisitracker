// Aligner History List Component
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';
import { Aligner, DailyUsage } from '../types';
import alignerCalculator from '../services/AlignerCalculator';

interface AlignerHistoryListProps {
    aligners: Aligner[];
    dailyUsageHistory: DailyUsage[];
    onMarkCompleted?: (alignerNumber: number) => void;
    onUnmarkCompleted?: (alignerNumber: number) => void;
}

function AlignerHistoryItem({
    aligner,
    isCurrent,
    dailyUsageForAligner,
    onMarkCompleted,
    onUnmarkCompleted
}: {
    aligner: Aligner;
    isCurrent: boolean;
    dailyUsageForAligner: DailyUsage[];
    onMarkCompleted?: (alignerNumber: number) => void;
    onUnmarkCompleted?: (alignerNumber: number) => void;
}) {
    const [expanded, setExpanded] = useState(false);
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

    const totalTimeWithout = dailyUsageForAligner.reduce(
        (sum, day) => sum + day.secondsWithoutAligner,
        0
    );

    const hasUsageData = dailyUsageForAligner.length > 0;

    return (
        <>
            <TouchableOpacity
                style={[styles.item, isCurrent && styles.itemCurrent]}
                onPress={() => {
                    if (aligner.completed) {
                        onUnmarkCompleted?.(aligner.alignerNumber);
                    } else {
                        onMarkCompleted?.(aligner.alignerNumber);
                    }
                }}
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

                <View style={styles.rightContainer}>
                    <View style={styles.badgeContainer}>
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

                    <TouchableOpacity
                        onPress={() => setExpanded(!expanded)}
                        style={styles.expandButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name={expanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.expandedContent}>
                    {hasUsageData ? (
                        <>
                            <View style={styles.totalUsage}>
                                <Text style={styles.totalUsageLabel}>Total sin aparato:</Text>
                                <Text style={styles.totalUsageValue}>
                                    {alignerCalculator.formatTimeWithoutAligner(totalTimeWithout)}
                                </Text>
                            </View>

                            <View style={styles.dailyBreakdown}>
                                <Text style={styles.dailyBreakdownTitle}>Detalle por día:</Text>
                                {dailyUsageForAligner.map((day) => (
                                    <View key={day.date} style={styles.dailyItem}>
                                        <Text style={styles.dailyDate}>
                                            {new Date(day.date).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </Text>
                                        <Text style={styles.dailyTime}>
                                            {alignerCalculator.formatTimeWithoutAligner(day.secondsWithoutAligner)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.noDataText}>
                            No hay registros de tiempo sin aparato para este alineador.
                        </Text>
                    )}
                </View>
            )}
        </>
    );
}

export function AlignerHistoryList({ aligners, dailyUsageHistory, onMarkCompleted, onUnmarkCompleted }: AlignerHistoryListProps) {
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
            renderItem={({ item }) => {
                const dailyUsageForAligner = dailyUsageHistory.filter(
                    (usage) => usage.alignerNumber === item.alignerNumber
                );

                return (
                    <AlignerHistoryItem
                        aligner={item}
                        isCurrent={item.alignerNumber === currentNumber}
                        dailyUsageForAligner={dailyUsageForAligner}
                        onMarkCompleted={onMarkCompleted}
                        onUnmarkCompleted={onUnmarkCompleted}
                    />
                );
            }}
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
        flex: 1, // Let it take available space
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
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
    badgeContainer: {
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
    expandButton: {
        padding: spacing.xs,
    },
    expandedContent: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginTop: spacing.xs,
        marginBottom: spacing.sm,
        marginHorizontal: spacing.xs,
    },
    noDataText: {
        ...typography.caption,
        color: colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: spacing.sm,
    },
    totalUsage: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    totalUsageLabel: {
        ...typography.body,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    totalUsageValue: {
        ...typography.body,
        color: colors.warning,
        fontWeight: '700',
        fontSize: 16,
    },
    dailyBreakdown: {
        marginTop: spacing.md,
        gap: spacing.xs,
    },
    dailyBreakdownTitle: {
        ...typography.caption,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.xs,
    },
    dailyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    dailyDate: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    dailyTime: {
        ...typography.bodySmall,
        color: colors.textPrimary,
        fontWeight: '600',
    },
});

export default AlignerHistoryList;
