import Header3 from 'components/Headers/Header3';
import React from 'react';
import { StyleSheet } from 'react-native';
import COLORS from 'shared/COLORS';

const BigErrorMessage = ({ children }) => {
    return <Header3 style={styles.errorHeader}>{children}</Header3>;
};

const styles = StyleSheet.create({
    errorHeader: {
        textAlign: 'center',
        color: COLORS.error,
        marginVertical: 8,
    },
});

export default BigErrorMessage;
