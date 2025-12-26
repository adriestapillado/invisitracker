import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';

interface DatePickerModalProps {
    visible: boolean;
    date: Date;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
    minimumDate?: Date;
    maximumDate?: Date;
}

export function DatePickerModal({
    visible,
    date,
    onConfirm,
    onCancel,
    minimumDate,
    maximumDate
}: DatePickerModalProps) {
    const [selectedDate, setSelectedDate] = useState(date);

    const handleDateChange = (event: any, newDate?: Date) => {
        if (Platform.OS === 'android') {
            if (event.type === 'set' && newDate) {
                onConfirm(newDate);
            } else {
                onCancel();
            }
        } else {
            // iOS
            if (newDate) {
                setSelectedDate(newDate);
            }
        }
    };

    if (Platform.OS === 'android') {
        return visible ? (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
            />
        ) : null;
    }

    if (Platform.OS === 'web') {
        return (
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={onCancel}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onCancel}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity activeOpacity={1} style={styles.content}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onCancel}>
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <Text style={styles.title}>Seleccionar Fecha</Text>
                                <TouchableOpacity onPress={() => onConfirm(selectedDate)}>
                                    <Text style={styles.confirmText}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.pickerContainer}>
                                {React.createElement('input', {
                                    type: 'date',
                                    value: selectedDate.toISOString().split('T')[0],
                                    onChange: (e: any) => {
                                        const d = new Date(e.target.value);
                                        if (!isNaN(d.getTime())) {
                                            setSelectedDate(d);
                                        }
                                    },
                                    style: {
                                        padding: 16,
                                        fontSize: 16,
                                        borderWidth: 0,
                                        backgroundColor: 'transparent',
                                        color: colors.textPrimary,
                                        width: '100%',
                                        fontFamily: 'system-ui',
                                        textAlign: 'center'
                                    }
                                })}
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    // iOS Modal implementation
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onCancel}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity activeOpacity={1} style={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onCancel}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>Seleccionar Fecha</Text>
                            <TouchableOpacity onPress={() => onConfirm(selectedDate)}>
                                <Text style={styles.confirmText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.pickerContainer}>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={selectedDate}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                minimumDate={minimumDate}
                                maximumDate={maximumDate}
                                textColor={colors.textPrimary}
                                themeVariant="light"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        paddingBottom: spacing.xl,
    },
    content: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card,
    },
    title: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    cancelText: {
        ...typography.body,
        color: colors.error,
    },
    confirmText: {
        ...typography.body,
        color: colors.primary,
        fontWeight: '600',
    },
    pickerContainer: {
        backgroundColor: colors.background,
        paddingTop: spacing.sm,
    },
});

export default DatePickerModal;
