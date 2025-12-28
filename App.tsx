// Main App Entry Point
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import WebAnalytics from './src/components/WebAnalytics';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { Screen } from './src/types';
import colors from './src/styles/colors';

// Screens
import SetupScreen from './src/screens/SetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NavigationBar from './src/components/NavigationBar';

function AppContent() {
    const { appState, isLoading } = useAppContext();
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');

    const handleSetupComplete = useCallback(() => {
        setCurrentScreen('home');
    }, []);

    const handleReset = useCallback(() => {
        setCurrentScreen('setup');
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // Show setup if not configured
    if (!appState.treatmentConfig.isConfigured) {
        return <SetupScreen onComplete={handleSetupComplete} />;
    }

    // Render current screen
    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return <HomeScreen />;
            case 'history':
                return <HistoryScreen />;
            case 'settings':
                return <SettingsScreen onReset={handleReset} />;
            default:
                return <HomeScreen />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.screenContainer}>
                {renderScreen()}
            </View>
            <NavigationBar
                currentScreen={currentScreen}
                onNavigate={setCurrentScreen}
            />
        </View>
    );
}

export default function App() {
    return (
        <AppProvider>
            <StatusBar style="light" />
            <AppContent />
            <WebAnalytics />
        </AppProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    screenContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});
