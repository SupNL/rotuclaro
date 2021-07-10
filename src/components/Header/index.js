import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Header = ({ children, ...rest }) => {
    return (
        <Text style={styles.header} {...rest}>{children}</Text>
    );
};

const styles = StyleSheet.create({
    header : {
        fontSize: 24,
        fontWeight: 'bold'
    }
});

export default Header;