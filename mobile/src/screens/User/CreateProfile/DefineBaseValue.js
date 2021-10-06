import React, { useRef } from 'react';
import Header from 'components/Header';
import { StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import CustomText from 'components/CustomText';
import Input from 'components/Input';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';

const DefineBaseValue = ({ navigation }) => {
    const formRef = useRef(null);

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = {};

        if (data['base-value-gram'] == null || data['base-value-gram'] == '') {
            errorList['base-value-gram'] = 'Informe um valor.';
        } else if (Number(data['base-value-gram']) <= 0) {
            errorList['base-value-gram'] = 'Informe um número maior que zero.';
        }

        if (data['base-value-ml'] == null || data['base-value-ml'] == '') {
            errorList['base-value-ml'] = 'Informe um valor.';
        } else if (Number(data['base-value-ml']) <= 0) {
            errorList['base-value-ml'] = 'Informe um número maior que zero.';
        }

        formRef.current.setErrors(errorList);
        if (Object.keys(errorList).length === 0) {
            navigation.navigate('DefineCutValues', {
                gramValue: data['base-value-gram'],
                mlValue: data['base-value-ml'],
            });
        }
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            <ScrollView>
                <Header>Definir valor de referência</Header>
                <CustomText style={styles.text}>
                    É o valor de referência para ser utilizado na hora de te
                    alertar. Esse é o valor que será apresentado como porção em
                    todos alimentos que você ver.
                </CustomText>
                <CustomText style={styles.text}>
                    Por exemplo, se o alimento originalmente indica 37 g, e você
                    marcou como 100 g, o alimento será representado em uma
                    porção de 100 g
                </CustomText>
                <CustomText style={styles.text}>
                    Você deve definir um valor para alimentos em gramas e
                    alimentos líquidos (em ml)
                </CustomText>
                <Form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    initialData={{
                        'base-value-gram': '100',
                        'base-value-ml': '200',
                    }}
                >
                    <Input
                        name='base-value-gram'
                        label='Valor de referência em gramas'
                        placeholder='Exemplo: 100 g'
                        type='number'
                        suffix='g'
                        style={{
                            text: { textAlign: 'right' },
                            marginBottom: 8,
                        }}
                    />
                    <Input
                        name='base-value-ml'
                        label='Valor de referência em ml'
                        placeholder='Exemplo: 200 ml'
                        type='number'
                        suffix='ml'
                        style={{
                            text: { textAlign: 'right' },
                            marginBottom: 8,
                        }}
                    />
                    <CustomButton
                        title='Continuar'
                        onPress={() => formRef.current.submitForm()}
                    />
                </Form>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
    },
});

export default DefineBaseValue;
