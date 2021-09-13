import React from 'react';
import { Text, StyleSheet } from 'react-native';
import COLORS from 'shared/COLORS';

const InputErrorText = ({ style, ...rest}) => {
    return (
        <Text style={{...styles.text, ...style}} {...rest} />
    );
};

const styles = StyleSheet.create({
    text : {
        fontSize : 14,
        fontWeight: 'bold',
        color : COLORS.error
    }
});

export default InputErrorText;