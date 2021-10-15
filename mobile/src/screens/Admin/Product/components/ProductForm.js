import React, { useEffect, useState } from 'react';
import { Form } from '@unform/mobile';
import { StyleSheet, View } from 'react-native';
import CustomButton from 'components/CustomButton';
import axios from 'axios';
import CustomModal from 'components/CustomModal';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { fetchAlergenicComponents } from 'services/alergenicComponents/fetchAlergenicComponent';
import handleCameraPermission from 'utils/handleCameraPermission';
import Input from 'components/Input';
import SelectListedComponents from 'components/SelectListedComponents';
import FormCheckbox from 'components/FormCheckbox';
import LoadingCircle from 'components/LoadingCircle';

export const formValidation = (data) => {
    const errorList = {};
    if (data.codigo == null || data.codigo == '') {
        errorList.codigo = 'Obrigatório';
    }
    if (data.nome == null || data.nome == '') {
        errorList.nome = 'Obrigatório';
    }
    if (data.gramasOuMlPorcao == null || data.gramasOuMlPorcao == '') {
        errorList.gramasOuMlPorcao = 'Obrigatório';
    } else if (parseInt(data.gramasOuMlPorcao) == 0) {
        errorList.gramasOuMlPorcao = 'Deve ser maior que zero';
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
    return errorList;
};

const ProductForm = ({
    formRef,
    handleSubmit,
    submitButtonLabel,
    submitIsLoading,
    initialData,
    initialComponents,
    selectedComponents,
    setSelectedComponents,
    codeIsDisabled,
}) => {
    const [components, setComponents] = useState();
    const [isComponentsLoading, setIsComponentsLoading] = useState(true);
    const [componentsModalVisible, setComponentsModalVisible] = useState(false);

    const [isLiquid, setIsLiquid] = useState();

    const [modalVisible, setModalVisible] = useState(false);
    const [scanned, setScanned] = useState(true);
    const [hasPermission, setHasPermission] = useState(true);

    const componentSource = axios.CancelToken.source();

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

    useEffect(() => {
        setSelectedComponents(initialComponents ? initialComponents : []);
    }, [initialComponents]);

    useEffect(() => {
        return () => {
            try {
                componentSource.cancel();
            } catch (err) {
                if (axios.isCancel(err)) console.err(err);
            }
        };
    }, []);

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

    return (
        <Form
            initialData={initialData}
            ref={formRef}
            onSubmit={handleSubmit}
            style={styles.formWrapper}
        >
            {readCodeModal}
            {componentsModal}
            <View style={{ marginBottom: 8 }}>
                <Input
                    name='codigo'
                    label='Código'
                    type='number'
                    placeholder='Código do produto'
                    editable={!submitIsLoading && !codeIsDisabled}
                    style={{ marginBottom: 4 }}
                />
                {!codeIsDisabled && (
                    <CustomButton
                        title='Ler código'
                        disabled={submitIsLoading}
                        onPress={() => handleModalVisible(true)}
                    />
                )}
            </View>
            <Input
                name='nome'
                label='Nome do produto'
                placeholder='Um nome descritivo para o produto'
                editable={!submitIsLoading}
                style={{ marginBottom: 8 }}
            />
            <FormCheckbox
                name='liquido'
                label='Porção em ML'
                setExternalTracker={setIsLiquid}
                disabled={submitIsLoading}
            />
            <Input
                name='gramasOuMlPorcao'
                label={(isLiquid ? 'ML' : 'Gramas') + ' por porção'}
                placeholder={
                    (isLiquid ? 'ML' : 'Gramas') + ' por porção no rótulo'
                }
                type='number'
                suffix={isLiquid ? 'ml' : 'g'}
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
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
                editable={!submitIsLoading}
                style={{
                    marginBottom: 8,
                }}
            />
            <Input
                name='ingredientes'
                label='Lista de ingredientes'
                placeholder='Lista de ingredientes'
                multiline={true}
                editable={!submitIsLoading}
                style={{
                    marginBottom: 16,
                }}
            />

            <CustomButton
                title='Selecionar componentes alergênicos'
                disabled={submitIsLoading}
                style={{ marginBottom: 8 }}
                onPress={() => {
                    if (!components) handleComponentsFetch();
                    setComponentsModalVisible(true);
                }}
            />

            {submitIsLoading ? (
                <LoadingCircle />
            ) : (
                <CustomButton
                    title={submitButtonLabel}
                    style={{ marginBottom: 8 }}
                    onPress={() => formRef.current.submitForm()}
                />
            )}
        </Form>
    );
};

const styles = StyleSheet.create({
    formWrapper: {
        flex: 1,
        padding: 16,
        width: '100%',
    },
});

export default ProductForm;
