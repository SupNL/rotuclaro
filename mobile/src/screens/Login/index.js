import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import Input from 'components/Input';
import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';
import { useAuth } from 'hooks/useAuth';
import ShowToast from 'utils/ShowToast';

const Login = ({ navigation }) => {
    const formRef = useRef(null);
    const { signIn } = useAuth();

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = {};
        if (data.username == null) {
            errorList.username = 'Nome de usuário obrigatório';
        }
        if (data.password == null) {
            errorList.password = 'Senha obrigatória';
        }
        if (Object.keys(errorList).length) {
            formRef.current.setErrors(errorList);
        } else {
            signIn(data.username, data.password)
                .then(({ usuario }) => {
                    if (usuario.nivel == 0) {
                        navigation.replace('AdminNav');
                    } else {
                        navigation.replace('UserNav');
                    }
                })
                .catch((err) => {
                    if (err.response.status == 401) {
                        ShowToast(err.response.data.message);
                    } else {
                        ShowToast(
                            'Ocorreu um erro inesperado. Tente novamente mais tarde.'
                        );
                    }
                });
        }
    };

    return (
        <View style={sharedStyles.alignedScreen}>
            <Form
                ref={formRef}
                onSubmit={handleSubmit}
                style={styles.formWrapper}
            >
                <Input
                    name='username'
                    label='Nome de usuário'
                    placeholder='Nome de usuário'
                    style={{ marginBottom: 8 }}
                />
                <Input
                    name='password'
                    label='Senha'
                    placeholder='Senha'
                    type='password'
                    style={{ marginBottom: 8 }}
                />
                <CustomButton
                    title='Entrar'
                    style={{ marginBottom: 8 }}
                    onPress={() => formRef.current.submitForm()}
                />
                <CustomButton
                    title='Criar uma conta'
                    onPress={() => navigation.navigate()}
                />
            </Form>
        </View>
    );
};

const styles = StyleSheet.create({
    formWrapper: {
        width: '60%',
        padding: 16,
    },
});

export default Login;
