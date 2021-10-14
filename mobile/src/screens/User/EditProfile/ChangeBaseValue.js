import React, { useRef, useState } from 'react';
import Header from 'components/Header';
import { StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import CustomText from 'components/CustomText';
import Input from 'components/Input';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from 'hooks/useAuth';
import ShowToast from 'utils/ShowToast';
import api from 'services/api';
import { Perfil } from 'model/Perfil';
import LoadingCircle from 'components/LoadingCircle';
const ChangeBaseValue = ({ navigation }) => {
    const formRef = useRef(null);

    const { perfil, updateProfile } = useAuth();

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

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
            setSubmitIsLoading(true);
            const submitData = {
                gramas: Number(data['base-value-gram']),
                ml: Number(data['base-value-ml']),
            };
            api.put('/perfil', submitData)
                .then((res) => {
                    const newProfile = res.data;
                    const dummyProfile = new Perfil(newProfile);
                    updateProfile(dummyProfile).then(() => {
                        ShowToast('Perfil atualizado');
                        navigation.goBack();
                    });
                })
                .catch(() => {
                    setSubmitIsLoading(false);
                });
        }
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            <ScrollView>
                <Header>Alterar valor de referência</Header>
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
                <CustomText style={{ ...styles.text, fontWeight: 'bold' }}>
                    ATENÇÃO: Alterar o valor de referência não ajustará os
                    valores de corte
                </CustomText>
                <Form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    initialData={{
                        'base-value-gram': perfil.gramas.toString(),
                        'base-value-ml': perfil.ml.toString(),
                    }}
                >
                    <Input
                        name='base-value-gram'
                        label='Valor de referência em gramas'
                        placeholder='Exemplo: 100 g'
                        type='number'
                        suffix='g'
                        editable={!submitIsLoading}
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
                        editable={!submitIsLoading}
                        style={{
                            text: { textAlign: 'right' },
                            marginBottom: 8,
                        }}
                    />
                    {submitIsLoading ? (
                        <LoadingCircle />
                    ) : (
                        <CustomButton
                            title='Salvar'
                            style={{ marginBottom: 8 }}
                            onPress={() => formRef.current.submitForm()}
                        />
                    )}
                    <CustomButton
                        title='Cancelar'
                        onPress={() => navigation.goBack()}
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

export default ChangeBaseValue;
