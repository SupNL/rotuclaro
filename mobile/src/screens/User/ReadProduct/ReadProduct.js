import React from 'react';
import { StyleSheet, View } from 'react-native';

import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';
import CustomText from 'components/CustomText';

const ReadProduct = ({ navigation }) => {

    const handleButtonPress = () => {
        navigation.navigate('BarCode');
    };

    return (
        <View style={sharedStyles.alignedScreen}>
            <CustomText style={styles.text}>Ler um produto</CustomText>
            <CustomButton
                title='Iniciar!'
                style={styles.button}
                onPress={handleButtonPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        marginBottom: 8,
    },
    button: {
        width: '40%',
    },
});

export default ReadProduct;
