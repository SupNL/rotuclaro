import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import Input from 'components/Input';
import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import CustomModal from 'components/CustomModal';
import { BarCodeScanner } from 'expo-barcode-scanner';
import handleCameraPermission from 'utils/handleCameraPermission';
import ShowToast from 'utils/ShowToast';
import SelectListedComponents from 'components/SelectListedComponents';
import { fetchAlergenicComponents } from 'services/alergenicComponents/fetchAlergenicComponent';
import axios from 'axios';
import { fetchOneProduct } from 'services/product/fetchProduct';
import Header2 from 'components/Headers/Header2';
import COLORS from 'shared/COLORS';

const EditProduct = ({ navigation, route }) => {
    const formRef = useRef(null);
    const scrollRef = useRef(null);
    const productId = route.params.productId;

    const [isLoading, setIsLoading] = useState(true);
    const [fetchedProduct, setFetchedProduct] = useState();
    const [isError, setIsError] = useState();

    const [components, setComponents] = useState();
    const [isComponentsLoading, setIsComponentsLoading] = useState(true);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [componentsModalVisible, setComponentsModalVisible] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [scanned, setScanned] = useState(true);
    const [hasPermission, setHasPermission] = useState(true);

    const componentSource = axios.CancelToken.source();
    const productSource = axios.CancelToken.source();

    const handleModalVisible = (status) => {
        setModalVisible(status);
        setScanned(!status);
    };

    const closeModal = () => {
        handleModalVisible(false);
    };

    const handleBarCodeScanned = ({ data }) => {
        closeModal();
        formRef.current.setFieldValue('codigo', data);
    };

    useEffect(() => {
        if (modalVisible) {
            BarCodeScanner.getPermissionsAsync().then((res) => {
                handleCameraPermission(
                    res,
                    hasPermission,
                    setHasPermission,
                    closeModal
                );
            });
        }
    }, [hasPermission, modalVisible]);

    const readCodeModal = (
        <CustomModal
            visible={modalVisible}
            onRequestClose={() => handleModalVisible(false)}
        >
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{
                    width: '100%',
                    height: '80%',
                }}
                barCodeTypes={[
                    BarCodeScanner.Constants.BarCodeType.ean13,
                    BarCodeScanner.Constants.BarCodeType.ean8,
                ]}
            />
            <CustomButton
                title='Cancelar'
                onPress={() => handleModalVisible(false)}
                style={{ marginTop: 'auto' }}
            />
        </CustomModal>
    );

    const handleComponentsFetch = () => {
        let lastName;
        if (components && components.length > 0)
            lastName = components[components.length - 1].nome;
        fetchAlergenicComponents(componentSource.token, lastName).then(
            ([fetchedComponents, count]) => {
                if (
                    components &&
                    components.length + fetchedComponents.length >= count
                ) {
                    setIsComponentsLoading(false);
                }

                setComponents((old) =>
                    old ? [...old, ...fetchedComponents] : fetchedComponents
                );
            }
        );
    };

    const componentsModal = (
        <CustomModal
            visible={componentsModalVisible}
            onRequestClose={() => setComponentsModalVisible(false)}
        >
            <SelectListedComponents
                components={components}
                selectedComponents={selectedComponents}
                setSelectedComponents={setSelectedComponents}
                isLoading={isComponentsLoading}
                handleFetch={handleComponentsFetch}
                style={{ height: '80%' }}
            />
            <CustomButton
                title='Confirmar'
                onPress={() => setComponentsModalVisible(false)}
                style={{ marginTop: 8 }}
            />
        </CustomModal>
    );

    useEffect(() => {
        fetchOneProduct(productSource.token, productId, 100)
            .then((product) => {
                setFetchedProduct(product);
                setSelectedComponents(product.componentesAlergenicos);
            })
            .catch((err) => {
                if (err.response) {
                    setIsError(err.response.status);
                } else {
                    setIsError(-1);
                }
            })
            .finally(() => setIsLoading(false));

        return () => {
            try {
                componentSource.cancel();
            } catch (err) {
                if (axios.isCancel(err)) console.err(err);
            }
            try {
                productSource.cancel();
            } catch (err) {
                if (axios.isCancel(err)) console.err(err);
            }
        };
    }, []);

    useEffect(() => {
        console.log(fetchedProduct);
    }, [fetchedProduct]);

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = {};

        if (data.codigo == null || data.codigo == '') {
            errorList.codigo = 'Obrigatório';
        }
        if (data.nome == null || data.nome == '') {
            errorList.nome = 'Obrigatório';
        }
        if (data.gramasPorcao == null || data.gramasPorcao == '') {
            errorList.gramasPorcao = 'Obrigatório';
        } else if (parseInt(data.gramasPorcao) == 0) {
            errorList.gramasPorcao = 'Deve ser maior que zero';
        }
        if (data.kcal == null || data.kcal == '') {
            errorList.kcal = 'Obrigatório';
        }
        if (data.carboidratos == null || data.carboidratos == '') {
            errorList.carboidratos = 'Obrigatório';
        }
        if (data.acucares == null || data.acucares == '') {
            errorList.acucares = 'Obrigatório';
        }
        if (data.gorduras == null || data.gorduras == '') {
            errorList.gorduras = 'Obrigatório';
        }
        if (data.gordurasSaturadas == null || data.gordurasSaturadas == '') {
            errorList.gordurasSaturadas = 'Obrigatório';
        }
        if (data.gordurasTrans == null || data.gordurasTrans == '') {
            errorList.gordurasTrans = 'Obrigatório';
        }
        if (data.sodio == null || data.sodio == '') {
            errorList.sodio = 'Obrigatório';
        }
        if (data.proteinas == null || data.proteinas == '') {
            errorList.proteinas = 'Obrigatório';
        }
        if (data.fibras == null || data.fibras == '') {
            errorList.fibras = 'Obrigatório';
        }
        if (data.ingredientes == null || data.ingredientes == '') {
            errorList.ingredientes = 'Obrigatório';
        }

        if (Object.keys(errorList).length) {
            formRef.current.setErrors(errorList);
            scrollRef.current.scrollTo({
                y: 0,
                animated: true,
            });
        } else {
            const submit_data = {
                ...data,
            };
            api.put(`/produto/${productId}`, submit_data)
                .then(() => {
                    ShowToast('Produto alterado com sucesso!');
                    navigation.goBack();
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status == 409) {
                            scrollRef.current.scrollTo({
                                y: 0,
                                animated: true,
                            });
                            formRef.current.setErrors({
                                codigo: 'Código em uso.',
                            });
                        }
                    }
                    console.log({ err });
                });
        }
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            {readCodeModal}
            {componentsModal}
            {isLoading ? (
                <ActivityIndicator color={COLORS.secondary} />
            ) : isError ? (
                <Header2>Ocorreu um erro na consulta do produto</Header2>
            ) : fetchedProduct && (
                <ScrollView ref={scrollRef}>
                    <Form
                        initialData={{
                            codigo: fetchedProduct.codigo,
                            nome: fetchedProduct.nome,
                            gramasPorcao: fetchedProduct.gramasPorcao.toString(),
                            kcal: fetchedProduct.kcal.toString(),
                            carboidratos: fetchedProduct.carboidratos.toString(),
                            acucares: fetchedProduct.acucares.toString(),
                            gorduras: fetchedProduct.gorduras.toString(),
                            gordurasSaturadas: fetchedProduct.gordurasSaturadas.toString(),
                            gordurasTrans: fetchedProduct.gordurasTrans.toString(),
                            sodio: fetchedProduct.sodio.toString(),
                            proteinas: fetchedProduct.proteinas.toString(),
                            fibras: fetchedProduct.fibras.toString(),
                            ingredientes: fetchedProduct.ingredientes,
                        }}
                        ref={formRef}
                        onSubmit={handleSubmit}
                        style={styles.formWrapper}
                    >
                        <View style={{ marginBottom: 8 }}>
                            <Input
                                name='codigo'
                                label='Código'
                                type='number'
                                placeholder='Código do produto'
                                style={{ marginBottom: 4 }}
                            />
                            <CustomButton
                                title='Ler código'
                                onPress={() => handleModalVisible(true)}
                            />
                        </View>
                        <Input
                            name='nome'
                            label='Nome do produto'
                            placeholder='Um nome descritivo para o produto'
                            style={{ marginBottom: 8 }}
                        />
                        <Input
                            name='gramasPorcao'
                            label='Gramas por porção'
                            placeholder='Gramas por porção no rótulo'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='kcal'
                            label='Kilocalorias na porção'
                            placeholder='Kilocalorias na porção'
                            type='number'
                            suffix='Kcal'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='carboidratos'
                            label='Carboidratos na porção'
                            placeholder='Carboidratos na porção'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='acucares'
                            label='Açúcares na porção'
                            placeholder='Açúcares na porção'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='gorduras'
                            label='Gorduras totais na porção'
                            placeholder='Gorduras totais na porção'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='gordurasSaturadas'
                            label='Gorduras saturadas na porção'
                            placeholder='Gorduras saturadas na porção'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='gordurasTrans'
                            label='Gorduras trans na porção'
                            placeholder='Gorduras trans na porção'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='sodio'
                            label='Sódio na porção'
                            placeholder='Sódio na porção'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='proteinas'
                            label='Proteínas na porção'
                            placeholder='Proteínas na porção'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='fibras'
                            label='Fibras na porção'
                            placeholder='Fibras na porção'
                            type='number'
                            suffix='g'
                            style={{
                                marginBottom: 8,
                            }}
                        />
                        <Input
                            name='ingredientes'
                            label='Lista de ingredientes'
                            placeholder='Lista de ingredientes'
                            multiline={true}
                            style={{
                                marginBottom: 16,
                            }}
                        />

                        <CustomButton
                            title='Selecionar componentes alergênicos'
                            style={{ marginBottom: 8 }}
                            onPress={() => {
                                if (!components) handleComponentsFetch();
                                setComponentsModalVisible(true);
                            }}
                        />

                        <CustomButton
                            title='Alterar produto'
                            style={{ marginBottom: 8 }}
                            onPress={() => formRef.current.submitForm()}
                        />
                    </Form>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    formWrapper: {
        flex: 1,
        padding: 16,
        width: '100%',
    },
});

export default EditProduct;
