import CustomText from 'components/CustomText';
import React from 'react';
import { StyleSheet } from 'react-native';

const Header1 = ({ style, ...rest}) => {
    return (
        <CustomText style={{...styles.text, ...style}} {...rest} />
    );
};

const styles = StyleSheet.create({
    text : {
        fontSize : 28
    }
});

export default Header1;