import { StyleSheet } from 'react-native';
import COLORS from './COLORS';

export default StyleSheet.create({
    defaultScreen: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    alignedScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    horizontalAlignedScreen: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    scrollAlign: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});

export const stackHeaderStyle = {
    headerTintColor: COLORS.white,
    headerStyle: {
        backgroundColor: COLORS.primary,
    },
};
