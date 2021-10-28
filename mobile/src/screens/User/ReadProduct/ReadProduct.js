import React from 'react';
import { StyleSheet, View } from 'react-native';

import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';
import CustomText from 'components/CustomText';
import { useAuth } from 'hooks/useAuth';

const ReadProduct = ({ navigation }) => {

    const { usuario } = useAuth();

    const handleButtonPress = () => {
        navigation.navigate('BarCode');
    };

    return (
        <View style={sharedStyles.alignedScreen}>
            <CustomText style={styles.text}>Bem-vindo, {usuario.nome}!</CustomText>
            <CustomText style={styles.text}>Vamos verificar um produto?</CustomText>
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
        fontSize: 20,
        marginBottom: 8,
    },
    button: {
        width: '40%',
        marginTop: 8,
        marginBottom: 24,
    },
});

export default ReadProduct;
