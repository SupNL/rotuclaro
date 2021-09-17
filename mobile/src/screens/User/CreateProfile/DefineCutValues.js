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

const DefineCutValues = ({ navigation, route }) => {
    const formRef = useRef(null);
    const baseValue = Number(route.params.baseValue);
    const proportionalBaseValue = baseValue * 100;

    const [check, setCheck] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setModalVisible(true);
    }, []);

    const minValue = 10;

    const handleSubmit = (data) => {
        navigation.navigate('ChooseAlergenicComponents', {
            baseValue: baseValue,
            limitValues: data,
        });
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

    return (
        <ScrollView>
            <View style={sharedStyles.defaultScreen}>
                {ModalScreen}
                <Header>Defina os valores de corte</Header>
                <CustomText style={styles.text}>
                    Para cada componente, informe um valor de corte desejado. As
                    gorduras saturadas e trans são opcionais.
                </CustomText>
                <CustomText style={styles.text}>
                    1. O primeiro corte te dará um alerta amarelo (médio), não é
                    grave mas necessita de sua atenção.
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
                        minValue={minValue}
                        maxValue={proportionalBaseValue * 10}
                        label={`Valor energético (Kcal) em ${
                            proportionalBaseValue / 100
                        } g`}
                        suffix=' Kcal'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='carbo-slider'
                        minValue={minValue}
                        maxValue={proportionalBaseValue}
                        label={`Carboidratos em ${
                            proportionalBaseValue / 100
                        } g`}
                        suffix=' g de carboidratos'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='sugar-slider'
                        minValue={minValue}
                        maxValue={proportionalBaseValue / 2}
                        label={`Açúcares em ${proportionalBaseValue / 100} g`}
                        suffix=' g de açúcares'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='fat-slider'
                        minValue={minValue}
                        maxValue={proportionalBaseValue}
                        label={`Gorduras totais em ${
                            proportionalBaseValue / 100
                        } g`}
                        suffix=' g de gorduras totais'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='sodium-slider'
                        minValue={minValue}
                        maxValue={proportionalBaseValue / 20}
                        label={`Sal (sódio) em ${
                            proportionalBaseValue / 100
                        } g`}
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
                                minValue={minValue}
                                maxValue={proportionalBaseValue / 2}
                                label={`Gorduras trans em ${
                                    proportionalBaseValue / 100
                                } g`}
                                suffix=' g de gorduras trans'
                                labelLeft='MÉDIO: '
                                labelRight='ALTO: '
                            />
                            <CustomSlider
                                name='fat-saturated-slider'
                                minValue={minValue}
                                maxValue={proportionalBaseValue / 2}
                                label={`Gorduras saturadas em ${
                                    proportionalBaseValue / 100
                                } g`}
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
