// Settings Screen - App settings
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
    Alert,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';
import { useAppContext } from '../context/AppContext';
import useNotifications from '../hooks/useNotifications';
import storageService from '../services/StorageService';
import { APP_VERSION } from '../constants/config';

interface SettingsScreenProps {
    onReset: () => void;
}

export function SettingsScreen({ onReset }: SettingsScreenProps) {
    const { appState, dispatch } = useAppContext();
    const { notificationsEnabled, toggleNotifications, hasPermission } = useNotifications();
    const [isResetting, setIsResetting] = useState(false);

    const handleResetData = () => {
        const doReset = async () => {
            setIsResetting(true);
            try {
                await storageService.clearStorage();
                dispatch({ type: 'RESET_ALL_DATA' });
                onReset();
            } catch (error) {
                console.error('Error resetting data:', error);
            } finally {
                setIsResetting(false);
            }
        };

        if (Platform.OS === 'web') {
            if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
                doReset();
            }
        } else {
            Alert.alert(
                'Eliminar datos',
                '¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Eliminar', style: 'destructive', onPress: doReset },
                ]
            );
        }
    };

    const formatTreatmentInfo = () => {
        if (!appState.treatmentConfig.isConfigured) {
            return 'No configurado';
        }
        return `Inicio: ${appState.treatmentConfig.treatmentStartDate}\n${appState.treatmentConfig.daysPerAligner} días por alineador\n${appState.treatmentConfig.totalAligners} alineadores totales`;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>⚙️ Ajustes</Text>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificaciones</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="notifications" size={24} color={colors.primary} />
                            <View>
                                <Text style={styles.settingLabel}>Recordatorios de cambio</Text>
                                <Text style={styles.settingHint}>
                                    Notificación a las 07:00 del día de cambio
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: colors.backgroundLight, true: colors.primary }}
                            thumbColor={colors.textPrimary}
                        />
                    </View>

                    {Platform.OS !== 'web' && !hasPermission && (
                        <Text style={styles.warningText}>
                            ⚠️ Permisos de notificación no concedidos
                        </Text>
                    )}

                    {Platform.OS === 'web' && (
                        <Text style={styles.infoText}>
                            ℹ️ Las notificaciones no están disponibles en la versión web
                        </Text>
                    )}
                </View>

                {/* Treatment info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información del tratamiento</Text>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoCardText}>
                            {formatTreatmentInfo()}
                        </Text>
                    </View>
                </View>

                {/* Statistics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estadísticas</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {appState.alignerHistory.filter(a => a.completed).length}
                            </Text>
                            <Text style={styles.statLabel}>Completados</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {appState.treatmentConfig.totalAligners - appState.alignerHistory.filter(a => a.completed).length}
                            </Text>
                            <Text style={styles.statLabel}>Restantes</Text>
                        </View>
                    </View>
                </View>

                {/* Danger zone */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, styles.dangerTitle]}>Zona de peligro</Text>

                    <TouchableOpacity
                        style={styles.dangerButton}
                        onPress={handleResetData}
                        disabled={isResetting}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="trash" size={24} color={colors.error} />
                        <Text style={styles.dangerButtonText}>
                            {isResetting ? 'Eliminando...' : 'Eliminar todos los datos'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* App info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appInfoText}>
                        Invisalign Tracker v{APP_VERSION}
                    </Text>
                    <Text style={styles.appInfoSubtext}>
                        Desarrollado con ❤️
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing.xl,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flex: 1,
    },
    settingLabel: {
        ...typography.body,
        color: colors.textPrimary,
    },
    settingHint: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    warningText: {
        ...typography.caption,
        color: colors.warning,
        marginTop: spacing.sm,
    },
    infoText: {
        ...typography.caption,
        color: colors.info,
        marginTop: spacing.sm,
    },
    infoCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },
    infoCardText: {
        ...typography.body,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    statItem: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        alignItems: 'center',
    },
    statValue: {
        ...typography.h1,
        color: colors.primary,
    },
    statLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    dangerTitle: {
        color: colors.error,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.error,
    },
    dangerButtonText: {
        ...typography.button,
        color: colors.error,
    },
    appInfo: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xxl,
    },
    appInfoText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    appInfoSubtext: {
        ...typography.caption,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
});

export default SettingsScreen;
