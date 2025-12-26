// Setup Screen - Initial configuration
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';
import { useAppContext } from '../context/AppContext';
import alignerCalculator from '../services/AlignerCalculator';
import notificationService from '../services/NotificationService';
import { formatDate } from '../constants/config';
import DatePickerModal from '../components/DatePickerModal';

interface SetupScreenProps {
    onComplete: () => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
    const { dispatch } = useAppContext();

    // Default to today
    const today = new Date();
    const [startDate, setStartDate] = useState(formatDate(today));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [daysPerAligner, setDaysPerAligner] = useState('14');
    const [totalAligners, setTotalAligners] = useState('20');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        // Validate inputs
        const days = parseInt(daysPerAligner, 10);
        const total = parseInt(totalAligners, 10);

        if (!startDate) {
            showAlert('Error', 'Por favor ingresa la fecha de inicio.');
            return;
        }
        if (isNaN(days) || days < 1 || days > 30) {
            showAlert('Error', 'Los días por alineador deben ser entre 1 y 30.');
            return;
        }
        if (isNaN(total) || total < 1 || total > 100) {
            showAlert('Error', 'El número total de alineadores debe ser entre 1 y 100.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate aligner schedule
            const alignerHistory = alignerCalculator.generateAlignerSchedule(
                startDate,
                days,
                total
            );

            // Request notification permissions and schedule
            await notificationService.requestPermissions();
            await notificationService.reschedulePendingNotifications(alignerHistory);

            // Update state
            dispatch({
                type: 'START_SETUP',
                payload: {
                    startDate,
                    daysPerAligner: days,
                    totalAligners: total,
                    alignerHistory,
                },
            });

            onComplete();
        } catch (error) {
            console.error('Error during setup:', error);
            showAlert('Error', 'Hubo un error al configurar. Intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>
                <Ionicons name="medical" size={64} color={colors.primary} />
                <Text style={styles.title}>Invisalign Tracker</Text>
                <Text style={styles.subtitle}>
                    Configura tu tratamiento para comenzar
                </Text>
            </View>

            <View style={styles.form}>
                {/* Start Date */}
                {/* Start Date */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fecha de inicio del tratamiento</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="calendar-outline" size={24} color={colors.textPrimary} />
                        <Text style={styles.dateButtonText}>
                            {new Date(startDate).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={styles.hint}>
                        La fecha en que te pusiste el primer alineador
                    </Text>
                </View>

                <DatePickerModal
                    visible={showDatePicker}
                    date={new Date(startDate)}
                    onConfirm={(date) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setStartDate(`${year}-${month}-${day}`);
                        setShowDatePicker(false);
                    }}
                    onCancel={() => setShowDatePicker(false)}
                />

                {/* Days per aligner */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Días por alineador</Text>
                    <TextInput
                        style={styles.input}
                        value={daysPerAligner}
                        onChangeText={setDaysPerAligner}
                        keyboardType="numeric"
                        placeholder="14"
                        placeholderTextColor={colors.textMuted}
                    />
                    <Text style={styles.hint}>
                        Normalmente son 14 días por alineador
                    </Text>
                </View>

                {/* Total aligners */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Número total de alineadores</Text>
                    <TextInput
                        style={styles.input}
                        value={totalAligners}
                        onChangeText={setTotalAligners}
                        keyboardType="numeric"
                        placeholder="20"
                        placeholderTextColor={colors.textMuted}
                    />
                    <Text style={styles.hint}>
                        Tu ortodoncista te indicó cuántos son
                    </Text>
                </View>

                {/* Submit button */}
                <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                >
                    <Ionicons name="checkmark-circle" size={24} color={colors.textPrimary} />
                    <Text style={styles.buttonText}>
                        {isSubmitting ? 'Configurando...' : 'Comenzar seguimiento'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                <Text style={styles.footerText}>
                    Recibirás notificaciones a las 07:00 el día de cambio de alineador
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
        marginTop: spacing.md,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    form: {
        gap: spacing.lg,
    },
    inputGroup: {
        gap: spacing.xs,
    },
    label: {
        ...typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    hint: {
        ...typography.caption,
        color: colors.textMuted,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        gap: spacing.sm,
        marginTop: spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        ...typography.button,
        color: colors.textPrimary,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        marginTop: spacing.xxl,
        paddingHorizontal: spacing.lg,
    },
    footerText: {
        ...typography.caption,
        color: colors.textMuted,
        textAlign: 'center',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
    },
    dateButtonText: {
        ...typography.body,
        color: colors.textPrimary,
        flex: 1,
    },
});

export default SetupScreen;
