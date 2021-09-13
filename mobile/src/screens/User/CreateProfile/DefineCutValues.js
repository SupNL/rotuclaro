import React, { useRef, useState } from 'react';
import Header from 'components/Header';
import CheckBox from '@react-native-community/checkbox';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Form } from '@unform/mobile';

import CustomText from 'components/CustomText';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import CustomSlider from 'components/CustomSlider';

const DefineCutValues = ({ navigation, route }) => {
    const formRef = useRef(null);
    const baseValue = Number(route.params.baseValue);
    const proportionalBaseValue = baseValue * 100;

    const [check, setCheck] = useState(false);

    const minValue = 10;

    const handleSubmit = (data) => {
        navigation.navigate('ChooseAlergenicComponents', {
            baseValue: baseValue,
            limitValues: data,
        });
    };

    return (
        <ScrollView>
            <View style={sharedStyles.defaultScreen}>
                <Header>Defina os valores de corte</Header>
                <CustomText style={styles.text}>
                    Para cada componente, ele terá dois valores de corte:
                </CustomText>
                <CustomText style={styles.text}>
                    1. O primeiro corte te dará um alerta amarelo (médio), não é
                    grave mas necessita de sua atenção.
                </CustomText>
                <CustomText style={styles.text}>
                    2. O segundo corte te dará um alerta vermelho (ALTO), na
                    qual o componente será considerado em excesso no produto.
                </CustomText>
                <CustomText style={styles.text}>
                    Observação: o valor máximo dos componentes abaixo é o valor
                    base definido anteriormente.
                </CustomText>
                <Form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    initialData={{
                        // em 100g,
                        'kcal-slider': [
                            proportionalBaseValue * 3,
                            proportionalBaseValue * 5,
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
                        suffix=' g'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
                    <CustomSlider
                        name='sugar-slider'
                        minValue={minValue}
                        maxValue={proportionalBaseValue / 2}
                        label={`Açúcares em ${proportionalBaseValue / 100} g`}
                        suffix=' g'
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
                        suffix=' g'
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
                                suffix=' g'
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
                                suffix=' g'
                                labelLeft='MÉDIO: '
                                labelRight='ALTO: '
                            />
                        </>
                    )}
                    <CustomSlider
                        name='sodium-slider'
                        minValue={minValue}
                        maxValue={proportionalBaseValue / 20}
                        label={`Sal (sódio) em ${
                            proportionalBaseValue / 100
                        } g`}
                        suffix=' g'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                    />
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
    },
});

export default DefineCutValues;
