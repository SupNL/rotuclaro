import React, { useEffect, useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    ToastAndroid,
    ScrollView,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import CustomButton from 'components/CustomButton';
import CustomModal from 'components/CustomModal';
import CustomText from 'components/CustomText';
import api from 'services/api';
import getUniqueId from 'utils/getUniqueId';
import ShowToast from 'utils/ShowToast';
import { useAuth } from 'hooks/useAuth';
import ProductAlert from 'components/ProductAlert';
import handleCameraPermission from 'utils/handleCameraPermission';

const BarCode = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [visibleAlertModal, setVisibleAlertModal] = useState(false);
    const [visibleNotFoundModal, setVisibleNotFoundModal] = useState(false);
    const [visibleRequisitionsModal, setVisibleRequisitionsModal] =
        useState(false);

    const [product, setProduct] = useState();
    const [alert, setAlert] = useState({});

    const { perfil } = useAuth();

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        getUniqueId().then((idunico) => {
            api.get(`/produto/${data}`, {
                headers: {
                    idunico,
                },
            })
                .then((res) => {
                    setProduct(res.data);
                    setVisibleAlertModal(true);
                    const avisos = perfil.informarRestricoes(res.data);
                    setAlert(avisos);
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status == 404) {
                            setVisibleNotFoundModal(true);
                        } else if (err.response.status == 429) {
                            setVisibleRequisitionsModal(true);
                        }
                    }
                });
        });
    };
    
    useEffect(() => {
        if (!scanned) {
            setVisibleAlertModal(false);
            setVisibleNotFoundModal(false);
            setVisibleRequisitionsModal(false);
        }
    }, [scanned]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setScanned(false);
        });
        return unsubscribe;
    }, [navigation]);

    const ProductNotFoundModalScreen = (
        <CustomModal
            visible={visibleNotFoundModal}
            onRequestClose={() => {
                setScanned(false);
            }}
        >
            <CustomText>
                O produto ainda não está cadastrado. Deseja solicitar o cadastro
                deste produto?
            </CustomText>
            <CustomButton
                title='Solicitar cadastro'
                onPress={() => {
                    ShowToast('Enviada.', ToastAndroid.TOP);
                    setScanned(false);
                }}
                style={{ marginTop: 8 }}
            />
            <CustomButton
                title='Ler outro produto'
                onPress={() => {
                    setScanned(false);
                }}
                style={{ marginTop: 8 }}
            />
        </CustomModal>
    );

    const ProductAlertModalScreen = (
        <CustomModal
            visible={visibleAlertModal}
            onRequestClose={() => {
                setScanned(false);
            }}
        >
            {product && (
                <>
                    <ScrollView>
                        <ProductAlert
                            alert={alert}
                            profile={perfil}
                            product={product}
                        />
                    </ScrollView>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                        <CustomButton
                            title='Ver detalhes'
                            onPress={() => {
                                navigation.navigate('ProductDetails', {
                                    alert, profile : perfil, product
                                });
                            }}
                            style={{ flex: 1 }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <CustomButton
                            title='Voltar'
                            onPress={() => {
                                setScanned(false);
                            }}
                            style={{ flex: 1, marginRight: 8 }}
                        />
                        <CustomButton
                            title='Menu'
                            onPress={navigation.goBack}
                            style={{ flex: 1 }}
                        />
                    </View>
                </>
            )}
        </CustomModal>
    );

    const RequisitionsLimitModal = (
        <CustomModal
            visible={visibleRequisitionsModal}
            onRequestClose={() => {
                setScanned(false);
            }}
        >
            <CustomText>Aguarde um pouco antes de ler um produto</CustomText>
            <CustomButton
                title='Ok'
                onPress={() => {
                    setScanned(false);
                }}
                style={{ marginTop: 8 }}
            />
        </CustomModal>
    );

    useEffect(() => {
        BarCodeScanner.getPermissionsAsync().then((res) => {
            handleCameraPermission(res, hasPermission, setHasPermission, navigation.goBack);
        });
    }, [hasPermission]);

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar hidden={true} />
            {ProductAlertModalScreen}
            {ProductNotFoundModalScreen}
            {RequisitionsLimitModal}
            {hasPermission && (
                <BarCodeScanner
                    onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                    }
                    style={StyleSheet.absoluteFillObject}
                    barCodeTypes={[
                        BarCodeScanner.Constants.BarCodeType.ean13,
                        BarCodeScanner.Constants.BarCodeType.ean8,
                    ]}
                ></BarCodeScanner>
            )}

            <CustomButton
                title='Voltar'
                style={styles.button}
                onPress={navigation.goBack}
            />
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
