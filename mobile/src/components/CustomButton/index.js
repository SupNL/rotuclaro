import React from 'react';
import { Button, View } from 'react-native';

const CustomButton = ({ style, ...rest}) => {
    return (
        <View style={style}>
            <Button {...rest} />
        </View>
    );
};

export default CustomButton;