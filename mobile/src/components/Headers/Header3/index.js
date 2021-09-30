import CustomText from 'components/CustomText';
import React from 'react';
import { StyleSheet } from 'react-native';

const Header3 = ({ style, ...rest}) => {
    return (
        <CustomText style={{...styles.text, ...style}} {...rest} />
    );
};

const styles = StyleSheet.create({
    text : {
        fontSize : 20
    }
});

export default Header3;