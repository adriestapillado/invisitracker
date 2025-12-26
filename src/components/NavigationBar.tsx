// Navigation Bar Component
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import spacing, { borderRadius } from '../styles/spacing';
import typography from '../styles/typography';
import { Screen } from '../types';

interface NavigationBarProps {
    currentScreen: Screen;
    onNavigate: (screen: Screen) => void;
}

interface NavItem {
    screen: Screen;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
}

const navItems: NavItem[] = [
    { screen: 'home', icon: 'home', label: 'Inicio' },
    { screen: 'history', icon: 'list', label: 'Historial' },
    { screen: 'settings', icon: 'settings', label: 'Ajustes' },
];

export function NavigationBar({ currentScreen, onNavigate }: NavigationBarProps) {
    return (
        <View style={styles.container}>
            {navItems.map((item) => {
                const isActive = currentScreen === item.screen;
                return (
                    <TouchableOpacity
                        key={item.screen}
                        style={[styles.navItem, isActive && styles.navItemActive]}
                        onPress={() => onNavigate(item.screen)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive ? item.icon : `${item.icon}-outline` as keyof typeof Ionicons.glyphMap}
                            size={24}
                            color={isActive ? colors.primary : colors.textSecondary}
                        />
                        <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: spacing.sm,
        paddingTop: spacing.sm,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        gap: spacing.xs,
    },
    navItemActive: {
        // Active styling handled by icon/text color
    },
    navLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    navLabelActive: {
        color: colors.primary,
        fontWeight: '600',
    },
});

export default NavigationBar;
