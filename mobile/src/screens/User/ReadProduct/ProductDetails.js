import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';
import ProductCompleteDetails from 'components/ProductCompleteDetails';
import { Dimensions } from 'react-native';
import Header3 from 'components/Headers/Header3';

const ProductDetails = ({ route, navigation }) => {
    const { alert, profile, product } = route.params;

    const screenWidth = Dimensions.get('window').width;

    const handleButtonPress = () => {
        navigation.goBack();
    };

    return (
        <View style={sharedStyles.horizontalAlignedScreen}>
            <Header3>{product.nome}</Header3>
            <Header3 style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
                Porção de{' '}
                {product.liquido ? profile.ml + ' ml' : profile.gramas + ' g'}
            </Header3>
            <ScrollView contentContainerStyle={{ width: screenWidth * 0.85 }}>
                <ProductCompleteDetails alert={alert} product={product} />
            </ScrollView>
            <CustomButton
                title='Voltar'
                style={styles.button}
                onPress={handleButtonPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        marginTop: 16,
    },
});

export default ProductDetails;
