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
        console.log(data);
        navigation.navigate('DefineCutValues', {
            baseValue : data['base-value']
        });
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            <Header>Defina o valor base</Header>
            <CustomText style={styles.text}>
                Defina um valor base para ser utilizado como referência na hora
                de te alertar. Todos os alimentos terão esse mesmo valor de
                porção.
            </CustomText>
            <CustomText style={styles.text}>
                Os componentes alimentares (açúcares, gorduras, etc) serão
                calculados em cima desse valor (por exemplo, 5g de açúcar em
                100g é equivalente a 2.5g de açúcar em uma porção de 50g).
            </CustomText>
            <Form
                ref={formRef}
                onSubmit={handleSubmit}
                initialData={{ 'base-value': '100' }}
            >
                <Input
                    name='base-value'
                    label='Valor base'
                    placeholder='Valor base em gramas'
                    type='number'
                    suffix='g'
                    style={{
                        text: { textAlign: 'right' },
                        box: { marginBottom: 8 },
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
