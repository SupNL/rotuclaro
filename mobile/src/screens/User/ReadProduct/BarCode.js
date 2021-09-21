import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import CustomButton from 'components/CustomButton';
import ConfirmDialog from 'components/ConfirmDialog';
import CustomModal from 'components/CustomModal';
import CustomText from 'components/CustomText';
import api from 'services/api';
import getUniqueId from 'utils/getUniqueId';
import ShowToast from 'utils/ShowToast';
import { useAuth } from 'hooks/useAuth';

const BarCode = ({ navigation }) => {
    const { signOut } = useAuth();

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [visibleAlertModal, setVisibleAlertModal] = useState(false);
    const [visibleNotFoundModal, setVisibleNotFoundModal] = useState(false);

    const [product, setProduct] = useState();

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
                })
                .catch((err) => {
                    if (err.response.status == 404) {
                        setVisibleNotFoundModal(true);
                    } else if (err.response.status == 401) {
                        ShowToast('Sessão expirada.');
                        signOut();
                    }
                });
        });
    };

    const ProductNotFoundModalScreen = (
        <CustomModal
            visible={visibleNotFoundModal}
            onRequestClose={() => {
                setVisibleNotFoundModal((old) => !old);
            }}
        >
            <CustomText>
                O produto ainda não está cadastrado. Deseja solicitar o cadastro
                desse produto?
            </CustomText>
            <CustomButton
                title='Solicitar cadastro'
                onPress={() => {
                    ShowToast('Enviada.');
                    setVisibleNotFoundModal((old) => !old);
                    setScanned((old) => !old);
                }}
                style={{ marginTop: 8 }}
            />
            <CustomButton
                title='Ler outro produto'
                onPress={() => {
                    setVisibleNotFoundModal((old) => !old);
                    setScanned((old) => !old);
                }}
                style={{ marginTop: 8 }}
            />
        </CustomModal>
    );

    const ProductAlertModalScreen = (
        <CustomModal
            visible={visibleAlertModal}
            onRequestClose={() => {
                setVisibleAlertModal((old) => !old);
            }}
        >
            {product && (
                <>
                    <CustomText>Produto lido: {product.nome}</CustomText>
                    <CustomButton
                        title='Ler outro produto'
                        onPress={() => {
                            setVisibleAlertModal((old) => !old);
                            setScanned((old) => !old);
                        }}
                        style={{ marginTop: 8 }}
                    />
                    <CustomButton
                        title='Voltar ao menu'
                        onPress={navigation.goBack}
                        style={{ marginTop: 8 }}
                    />
                </>
            )}
        </CustomModal>
    );

    useEffect(() => {
        BarCodeScanner.getPermissionsAsync().then((res) => {
            if (!res.canAskAgain) {
                ConfirmDialog(
                    'Erro de permissão',
                    'A aplicação não tem permissão para usar a câmera. Atualize as permissões em configurações',
                    () => {
                        Linking.openSettings().then(
                            setTimeout(() => {
                                BarCodeScanner.getPermissionsAsync().then(
                                    (permission) => {
                                        if (permission.canAskAgain) {
                                            setHasPermission(
                                                permission.granted
                                            );
                                        } else {
                                            navigation.goBack();
                                        }
                                    }
                                );
                            }, 1)
                        );
                    },
                    navigation.goBack,
                    'Ir para configurações',
                    'Cancelar'
                );
            } else if (hasPermission === null) {
                BarCodeScanner.requestPermissionsAsync().then((permission) => {
                    setHasPermission(permission.granted);
                });
            } else if (hasPermission === false) {
                ConfirmDialog(
                    'Erro de permissão',
                    'O leitor de barras precisa de permissão da câmera. Dê a permissão para conseguir realizar uma leitura.',
                    () => {
                        setHasPermission(null);
                    },
                    navigation.goBack,
                    'Definir permissão',
                    'Cancelar'
                );
            }
        });
    }, [hasPermission]);

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar hidden={true} />
            {ProductAlertModalScreen}
            {ProductNotFoundModalScreen}
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
