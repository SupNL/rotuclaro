import React from 'react';
import { StyleSheet, View } from 'react-native';

import sharedStyles from 'shared/sharedStyles';
import CustomText from 'components/CustomText';

const MainScreen = ({ navigation }) => {
    return (
        <View style={sharedStyles.alignedScreen}>
            <CustomText style={styles.text}>Tela do administrador</CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        marginBottom: 8,
    },
});

export default MainScreen;
