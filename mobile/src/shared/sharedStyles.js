import { StyleSheet } from 'react-native';

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
