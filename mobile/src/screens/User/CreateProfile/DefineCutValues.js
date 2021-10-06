import React, { useRef, useState } from 'react';
import Header from 'components/Header';
import CheckBox from '@react-native-community/checkbox';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { Form } from '@unform/mobile';

import CustomText from 'components/CustomText';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import CustomSlider from 'components/CustomSlider';
import CustomModal from 'components/CustomModal';
import { useEffect } from 'react';
import Input from 'components/Input';
import COLORS from 'shared/COLORS';

const mapComponent = (name) => {
    switch (name) {
        case 'kcal-slider':
            return 'calorias';
        case 'carbo-slider':
            return 'carboidratos';
        case 'sugar-slider':
            return 'açúcares';
        case 'fat-slider':
            return 'gorduras totais';
        case 'fat-trans-slider':
            return 'gorduras trans';
        case 'fat-saturated-slider':
            return 'gorduras saturadas';
        case 'sodium-slider':
            return 'sódio';
    }
};

const DefineCutValues = ({ navigation, route }) => {
    const formRef = useRef(null);
    const gramValue = Number(route.params.gramValue);
    const mlValue = Number(route.params.mlValue);
    const proportionalBaseValue = gramValue * 100;

    const [check, setCheck] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [changeValueModalVisible, setChangeValueModalVisible] =
        useState(false);

    const [changingSlider, setChangingSlider] = useState(['', 0, 0]);

    useEffect(() => {
        setModalVisible(true);
    }, []);

    const minValue = 0;

    const handleSubmit = (data) => {
        navigation.navigate('ChooseAlergenicComponents', {
            gramValue,
            mlValue,
            limitValues: data,
        });
    };

    const handleLabelPress = (name, leftValue, rightValue) => {
        setChangingSlider([name, leftValue, rightValue]);
        setChangeValueModalVisible(true);
    };

    const ModalScreen = (
        <CustomModal
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible((old) => !old);
            }}
        >
            <CustomText>
                Estes cortes, como mostra a figura abaixo, vão poder te alertar
                quando o componente do alimento estiver em quantidade média
                (indicado por amarelo), e em quantidade alta (indicado em
                vermelho).
            </CustomText>
            <Image
                style={{
                    width: '100%',
                    resizeMode: 'contain',
                }}
                source={require('./images/cutsHelp.png')}
            />
            <CustomButton
                title='Entendi!'
                onPress={() => setModalVisible((old) => !old)}
                style={{ marginTop: 'auto' }}
            />
        </CustomModal>
    );

    const ChangeValueModalScreen = () => {
        const changeFormRef = useRef(null);

        const handleSubmit = (data) => {
            if (parseFloat(data.med) >= parseFloat(data.high)) {
                changeFormRef.current.setErrors({
                    med: 'O valor médio deve ser menor que o alto',
                });
            } else {
                formRef.current.setFieldValue(changingSlider[0], [
                    parseFloat(data.med) * 100,
                    parseFloat(data.high) * 100,
                ]);
                setChangeValueModalVisible(false);
            }
        };

        return (
            <CustomModal
                visible={changeValueModalVisible}
                onRequestClose={() => {
                    setChangeValueModalVisible(false);
                }}
            >
                <CustomText>
                    Alterando {mapComponent(changingSlider[0])}
                </CustomText>
                <Form
                    onSubmit={handleSubmit}
                    ref={changeFormRef}
                    initialData={{
                        med: (
                            Math.round(
                                (changingSlider[1] / 100 + Number.EPSILON) * 100
                            ) / 100
                        ).toString(),
                        high: (
                            Math.round(
                                (changingSlider[2] / 100 + Number.EPSILON) * 100
                            ) / 100
                        ).toString(),
                    }}
                >
                    <Input
                        name='med'
                        label='Médio'
                        placeholder='Corte médio'
                        type='number'
                        suffix={
                            mapComponent(changingSlider[0]) !== 'calorias'
                                ? 'g'
                                : 'kcal'
                        }
                        style={{
                            text: {
                                textAlign: 'right',
                            },
                            padding: 8,
                            backgroundColor: COLORS.warningLight,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                    />
                    <Input
                        name='high'
                        label='Alto'
                        placeholder='Corte alto'
                        type='number'
                        suffix={
                            mapComponent(changingSlider[0]) !== 'calorias'
                                ? 'g'
                                : 'kcal'
                        }
                        style={{
                            marginBottom: 8,
                            text: {
                                textAlign: 'right',
                            },
                            padding: 8,
                            backgroundColor: COLORS.errorLight,
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                        }}
                    />
                </Form>
                <View style={{ flexDirection: 'row' }}>
                    <CustomButton
                        title='Alterar'
                        onPress={() => changeFormRef.current.submitForm()}
                        style={{ flex: 1, marginRight: 4 }}
                    />
                    <CustomButton
                        title='Cancelar'
                        onPress={() => setChangeValueModalVisible(false)}
                        style={{ flex: 1 }}
                    />
                </View>
            </CustomModal>
        );
    };

    return (
        <ScrollView>
            <View style={sharedStyles.defaultScreen}>
                {ModalScreen}
                <ChangeValueModalScreen />
                <Header>Defina os valores de corte</Header>
                <CustomText style={styles.text}>
                    Para cada componente, informe um valor de corte desejado. As
                    gorduras saturadas e trans são opcionais.
                </CustomText>
                <CustomText style={styles.text}>
                    1. O primeiro corte te dará um alerta amarelo (médio),
                    mostrando que necessita de sua atenção.
                </CustomText>
                <CustomText style={styles.text}>
                    2. O segundo corte te dará um alerta vermelho (ALTO), na
                    qual o componente será considerado em excesso no produto.
                </CustomText>
                <CustomButton
                    title='Ajuda'
                    onPress={() => setModalVisible((old) => !old)}
                    style={{ marginBottom: 8 }}
                />
                <Form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    initialData={{
                        // em 100g,
                        'kcal-slider': [
                            3 * proportionalBaseValue,
                            5 * proportionalBaseValue,
                        ],
                        'carbo-slider': [
                            0.6 * proportionalBaseValue,
                            0.8 * proportionalBaseValue,
                        ],
                        // 100g, alerta em 10g e 15g
                        'sugar-slider': [
                            0.1 * proportionalBaseValue,
                            0.15 * proportionalBaseValue,
                        ],
                        // 100g, alerta em 10g e 20g
                        'fat-slider': [
                            0.1 * proportionalBaseValue,
                            0.2 * proportionalBaseValue,
                        ],
                        // 100g, alerta em 2g e 5g
                        'fat-trans-slider': [
                            0.02 * proportionalBaseValue,
                            0.05 * proportionalBaseValue,
                        ],
                        // 100g, alerta em 4g e 10g
                        'fat-saturated-slider': [
                            0.04 * proportionalBaseValue,
                            0.1 * proportionalBaseValue,
                        ],
                        // 100g, alerta em 3mg e 6mg
                        'sodium-slider': [
                            0.003 * proportionalBaseValue,
                            0.006 * proportionalBaseValue,
                        ],
                    }}
                    style={styles.align}
                >
                    <CustomSlider
                        name='kcal-slider'
                        handleLabelPress={handleLabelPress}
                        minValue={minValue}
                        maxValue={proportionalBaseValue * 8}
                        label={`Valor energético (Kcal) em ${gramValue} g / ${mlValue} ml`}
                        step={gramValue * 5}
                        suffix=' Kcal'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='carbo-slider'
                        handleLabelPress={handleLabelPress}
                        minValue={minValue}
                        maxValue={proportionalBaseValue}
                        label={`Carboidratos em ${gramValue} g / ${mlValue} ml`}
                        step={gramValue}
                        suffix=' g de carboidratos'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='sugar-slider'
                        handleLabelPress={handleLabelPress}
                        minValue={minValue}
                        maxValue={proportionalBaseValue}
                        label={`Açúcares em ${gramValue} g / ${mlValue} ml`}
                        step={gramValue}
                        suffix=' g de açúcares'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='fat-slider'
                        handleLabelPress={handleLabelPress}
                        minValue={minValue}
                        maxValue={proportionalBaseValue}
                        label={`Gorduras totais em ${gramValue} g / ${mlValue} ml`}
                        step={gramValue}
                        suffix=' g de gorduras totais'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='sodium-slider'
                        handleLabelPress={handleLabelPress}
                        minValue={minValue}
                        maxValue={proportionalBaseValue / 20}
                        label={`Sal (sódio) em ${gramValue} g / ${mlValue} ml`}
                        step={gramValue / 10}
                        suffix=' g de sal'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            value={check}
                            onChange={() => {
                                setCheck((old) => !old);
                            }}
                        />
                        <CustomText>
                            Apresentar gorduras saturadas e trans
                        </CustomText>
                    </View>

                    {check && (
                        <>
                            <CustomSlider
                                name='fat-trans-slider'
                                handleLabelPress={handleLabelPress}
                                minValue={minValue}
                                maxValue={proportionalBaseValue}
                                label={`Gorduras trans em ${gramValue} g / ${mlValue} ml`}
                                step={gramValue}
                                suffix=' g de gorduras trans'
                                labelLeft='MÉDIO: '
                                labelRight='ALTO: '
                            />
                            <CustomSlider
                                name='fat-saturated-slider'
                                handleLabelPress={handleLabelPress}
                                minValue={minValue}
                                maxValue={proportionalBaseValue}
                                label={`Gorduras saturadas em ${gramValue} g / ${mlValue} ml`}
                                step={gramValue}
                                suffix=' g de gorduras saturadas'
                                labelLeft='MÉDIO: '
                                labelRight='ALTO: '
                            />
                        </>
                    )}
                    <CustomButton
                        title='Continuar'
                        onPress={() => formRef.current.submitForm()}
                        style={{ width: '100%' }}
                    />
                </Form>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
    },
    align: {
        alignItems: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
});

export default DefineCutValues;
