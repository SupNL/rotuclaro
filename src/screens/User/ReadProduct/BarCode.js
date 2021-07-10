import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import CustomButton from 'components/CustomButton';
import ConfirmDialog from 'components/ConfirmDialog';

const BarCode = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const imageUrl = 'https://i.imgur.com/q5NqE14.png';

    useEffect(() => {
        if (hasPermission == false) {
            ConfirmDialog(
                'Erro de permissão.',
                'O leitor de barras precisa de permissão da câmera. Dê a permissão para conseguir realizar uma leitura.',
                (async () => {
                    const { status } =
                        await BarCodeScanner.requestPermissionsAsync();
                    setHasPermission(status === 'granted');
                })(),
                navigation.goBack(),
                'Definir permissão',
                'Cancelar'
            );
        } else if (hasPermission == null) {
            (async () => {
                const { status } =
                    await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === 'granted');
            })();
        }
    }, [hasPermission]);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        console.log(
            `Bar code with type ${type} and data ${data} has been scanned!`
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar hidden={true} />

            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
                barCodeTypes={[
                    BarCodeScanner.Constants.BarCodeType.ean13,
                    BarCodeScanner.Constants.BarCodeType.ean8,
                ]}
            >
                {scanned ? (
                    <ImageBackground
                        style={styles.image}
                        source={{ uri: imageUrl }}
                        resizeMode='contain'
                    />
                ) : undefined}
            </BarCodeScanner>
            <CustomButton title='Voltar' style={styles.button} onPress={navigation.goBack} />
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#FFF',
        backgroundColor: '#000',
    },
    button: {
        marginTop: 'auto',
        marginBottom: '5%',
        width: '40%',
        alignSelf: 'center',
    },
    image: {
        width: '100%',
        height: '90%',
    },
});

export default BarCode;
