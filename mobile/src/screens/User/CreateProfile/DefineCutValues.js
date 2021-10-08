import React, { useRef, useState } from 'react';
import Header from 'components/Header';
import { StyleSheet, ScrollView, View } from 'react-native';

import CustomText from 'components/CustomText';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import { useEffect } from 'react';
import CutValuesForm from 'components/CutValuesForm';
import CutValuesHelp from 'components/CutValuesHelp';

const DefineCutValues = ({ navigation, route }) => {
    const formRef = useRef(null);
    const gramValue = Number(route.params.gramValue);
    const mlValue = Number(route.params.mlValue);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setModalVisible(true);
    }, []);

    const handleSubmit = (data) => {
        navigation.navigate('ChooseAlergenicComponents', {
            gramValue,
            mlValue,
            limitValues: data,
        });
    };

    return (
        <ScrollView>
            <View style={sharedStyles.defaultScreen}>
                <CutValuesHelp modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
                <CutValuesForm
                    formRef={formRef}
                    submitLabel={'Continuar'}
                    handleSubmit={handleSubmit}
                    gramValue={gramValue}
                    mlValue={mlValue}
                    initialData={{
                        // em 100g,
                        'kcal-slider': [
                            3 * (gramValue * 100),
                            5 * (gramValue * 100),
                        ],
                        'carbo-slider': [
                            0.6 * (gramValue * 100),
                            0.8 * (gramValue * 100),
                        ],
                        // 100g, alerta em 10g e 15g
                        'sugar-slider': [
                            0.1 * (gramValue * 100),
                            0.15 * (gramValue * 100),
                        ],
                        // 100g, alerta em 10g e 20g
                        'fat-slider': [
                            0.1 * (gramValue * 100),
                            0.2 * (gramValue * 100),
                        ],
                        // 100g, alerta em 2g e 5g
                        'fat-trans-slider': [
                            0.02 * (gramValue * 100),
                            0.05 * (gramValue * 100),
                        ],
                        // 100g, alerta em 4g e 10g
                        'fat-saturated-slider': [
                            0.04 * (gramValue * 100),
                            0.1 * (gramValue * 100),
                        ],
                        // 100g, alerta em 3mg e 6mg
                        'sodium-slider': [
                            0.003 * (gramValue * 100),
                            0.006 * (gramValue * 100),
                        ],
                    }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
    },
});

export default DefineCutValues;
