import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ style, ...rest}) => {
    return (
        <Text style={{...styles.text, ...style}} {...rest} />
    );
};

const styles = StyleSheet.create({
    text : {
        fontSize : 16
    }
});

export default CustomText;