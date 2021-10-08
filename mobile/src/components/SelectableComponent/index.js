import CustomText from 'components/CustomText';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from 'shared/COLORS';

const SelectableComponent = ({ componentId, componentName, isSelected, onPressAction }) => {

    const onSelect = () => {
        onPressAction(componentId);
    };

    return (
        <TouchableOpacity
            style={isSelected ? {...styles.wrapper, ...styles.selected} : styles.wrapper}
            activeOpacity={0.6}
            onPress={onSelect}
        >
            <CustomText style={styles.text}>{componentName}</CustomText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.white,
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,

        borderWidth: 1,
    },
    text: {
        fontSize: 18,
    },
    selected: {
        borderWidth: 3,
        borderColor: COLORS.secondary,
        backgroundColor : COLORS.secondaryTint
    },
});

export default SelectableComponent;
