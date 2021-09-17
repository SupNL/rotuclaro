import React, { useRef } from 'react';
import Header from 'components/Header';
import { StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import CustomText from 'components/CustomText';
import Input from 'components/Input';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';

const DefineBaseValue = ({ navigation }) => {
    const formRef = useRef(null);

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        if (Number(data['base-value']) == 0) {
            formRef.current.setErrors({
                'base-value': 'Informe um número maior que zero.',
            });
        } else {
            navigation.navigate('DefineCutValues', {
                baseValue: data['base-value'],
            });
        }
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            <Header>Definir valor de referência</Header>
            <CustomText style={styles.text}>
                É o valor de referência para ser utilizado na hora de te
                alertar. Esse é o valor que será apresentado como porção em
                todos alimentos que você ver.
            </CustomText>
            <CustomText style={styles.text}>
                Os componentes alimentares (açúcares, gorduras, etc) serão
                baseados em cima desse valor (por exemplo, 5g de açúcar em uma
                porção de 100g, que é o equivalente a 2.5g de açúcar em uma
                porção de 50g).
            </CustomText>
            <Form
                ref={formRef}
                onSubmit={handleSubmit}
                initialData={{ 'base-value': '100' }}
            >
                <Input
                    name='base-value'
                    label='Valor de referência em gramas'
                    placeholder='Exemplo: 100 g'
                    type='number'
                    suffix='g'
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
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
    },
});

export default DefineBaseValue;
