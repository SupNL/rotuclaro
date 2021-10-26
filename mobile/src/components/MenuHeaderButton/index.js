import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-feather';
import COLORS from 'shared/COLORS';

const MenuHeaderButton = ({ navigation }) => {
    return (
        <TouchableOpacity
            style={styles.wrapper}
            onPress={() => navigation.openDrawer()}
        >
            <Menu
                stroke={COLORS.white}
                width={28}
                height={28}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 16,
    },
});

export default MenuHeaderButton;
