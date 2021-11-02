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
import api, { uninterceptedApi } from 'services/api';
import getUniqueId from 'utils/getUniqueId';
import ShowToast from 'utils/ShowToast';
import { useAuth } from 'hooks/useAuth';
import ProductAlert from 'components/ProductAlert';
import handleCameraPermission from 'utils/handleCameraPermission';
import LoadingCircle from 'components/LoadingCircle';
import BigErrorMessage from 'components/BigErrorMessage';

const BarCode = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [productModalVisible, setProductModalVisible] = useState(false);
    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [suggestionIsLoading, setSuggestionIsLoading] = useState(false);
    const [product, setProduct] = useState();
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({});

    const [code, setCode] = useState(null);

    const { perfil, signOut } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            setScanned(false);
            setSubmitIsLoading(false);
            setProductModalVisible(false);
            setSuggestionIsLoading(false);
            setAlert({});
        }, 1500);
    }, []);

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setProductModalVisible(true);
        setSubmitIsLoading(true);
        setCode(data);
        getUniqueId().then((idunico) => {
            api.get(`/produto/${data}`, {
                headers: {
                    idunico,
                },
            })
                .then((res) => {
                    setProduct(res.data);
                    const avisos = perfil.informarRestricoes(res.data);
                    setAlert(avisos);
                })
                .catch((err) => {
                    setProduct(null);
                    if (err.response) {
                        setError(err.response);
                    } else {
                        setError(err);
                    }
                })
                .finally(() => setSubmitIsLoading(false));
        });
    };

    useEffect(() => {
        if (!scanned) {
            setError(null);
            setProductModalVisible(false);
        }
    }, [scanned]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setScanned(false);
        });
        return unsubscribe;
    }, [navigation]);

    const UnknownErrorScreen = (
        <>
            <BigErrorMessage>Ocorreu um erro inesperado</BigErrorMessage>
            <CustomButton
                title='Ok'
                onPress={() => setScanned(false)}
                style={{ marginTop: 8 }}
            />
        </>
    );

    const ServerUnreachable = (
        <>
            <BigErrorMessage>
                O servidor não está respondendo. Tente novamente mais tarde.
            </BigErrorMessage>
            <CustomButton
                title='Ok'
                onPress={() => setScanned(false)}
                style={{ marginTop: 8 }}
            />
        </>
    );

    const RequisitionsScreen = (
        <>
            <CustomText>Aguarde um pouco antes de ler um produto</CustomText>
            <CustomButton
                title='Ok'
                onPress={() => setScanned(false)}
                style={{ marginTop: 8 }}
            />
        </>
    );

    const handleSuggestionSubmit = () => {
        setSuggestionIsLoading(true);
        getUniqueId().then((idunico) => {
            uninterceptedApi
                .post(
                    `/sugestao/${code}`,
                    {},
                    {
                        headers: {
                            idunico,
                        },
                    }
                )
                .then(() => {
                    ShowToast('Sugestão enviada.', ToastAndroid.TOP);
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status === 429) {
                            ShowToast(
                                'Você já enviou sugestão desse produto.',
                                ToastAndroid.TOP
                            );
                        } else if (err.response.status === 401) {
                            ShowToast('Sessão expirada.', ToastAndroid.TOP);
                            signOut();
                        } else {
                            ShowToast(
                                'Ocorreu um erro inesperado.',
                                ToastAndroid.TOP
                            );
                        }
                    } else {
                        ShowToast(
                            'Não foi possível entrar em contato com o servidor.',
                            ToastAndroid.TOP
                        );
                    }
                })
                .finally(() => {
                    setSuggestionIsLoading(false);
                    setScanned(false);
                });
        });
    };

    const ProductNotFoundScreen = (
        <>
            <CustomText>
                O produto ainda não está cadastrado. Deseja solicitar o cadastro
                deste produto?
            </CustomText>
            {suggestionIsLoading ? (
                <LoadingCircle />
            ) : (
                <>
                    <CustomButton
                        title='Solicitar cadastro'
                        onPress={handleSuggestionSubmit}
                        style={{ marginTop: 8 }}
                    />
                    <CustomButton
                        title='Ler outro produto'
                        onPress={() => {
                            setScanned(false);
                        }}
                        style={{ marginTop: 8 }}
                    />
                </>
            )}
        </>
    );

    const ProductAlertScreen = (
        <>
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
                                    alert,
                                    profile: perfil,
                                    product,
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
        </>
    );

    const ProductModal = (
        <CustomModal
            visible={productModalVisible}
            onRequestClose={() => setScanned(false)}
        >
            {submitIsLoading ? (
                <LoadingCircle />
            ) : error ? (
                error.status == 404 ? (
                    ProductNotFoundScreen
                ) : error.status == 429 ? (
                    RequisitionsScreen
                ) : error.status ? (
                    UnknownErrorScreen
                ) : (
                    ServerUnreachable
                )
            ) : (
                ProductAlertScreen
            )}
        </CustomModal>
    );

    useEffect(() => {
        BarCodeScanner.getPermissionsAsync().then((res) => {
            handleCameraPermission(
                res,
                hasPermission,
                setHasPermission,
                navigation.goBack
            );
        }).finally(() => setSubmitIsLoading(false));
    }, [hasPermission]);

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar hidden={true} />
            {ProductModal}
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
