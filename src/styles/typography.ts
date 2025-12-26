// Typography system for Invisalign Tracker
import { Platform } from 'react-native';

const fontFamily = Platform.select({
    web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    default: undefined,
});

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        fontFamily,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        fontFamily,
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        fontFamily,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        fontFamily,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        fontFamily,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        fontFamily,
    },
    timer: {
        fontSize: 56,
        fontWeight: '700' as const,
        fontFamily,
        letterSpacing: 2,
    },
    button: {
        fontSize: 16,
        fontWeight: '600' as const,
        fontFamily,
    },
};

export default typography;
