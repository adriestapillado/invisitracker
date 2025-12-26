// Home Screen - Main dashboard
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import typography from '../styles/typography';
import TimerDisplay from '../components/TimerDisplay';
import CurrentAlignerCard from '../components/CurrentAlignerCard';
import ProgressBar from '../components/ProgressBar';

export function HomeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>🦷 Invisalign Tracker</Text>
                    <Text style={styles.date}>
                        {new Date().toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        })}
                    </Text>
                </View>

                <TimerDisplay />
                <CurrentAlignerCard />
                <ProgressBar />
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
    date: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        textTransform: 'capitalize',
    },
});

export default HomeScreen;
