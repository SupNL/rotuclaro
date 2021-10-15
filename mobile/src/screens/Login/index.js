import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import Input from 'components/Input';
import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';
import { useAuth } from 'hooks/useAuth';
import LoadingCircle from 'components/LoadingCircle';

const Login = ({ navigation }) => {
    const formRef = useRef(null);
    const { signIn } = useAuth();

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = {};
        if (data.username == null || data.username == '') {
            errorList.username = 'Nome de usuário obrigatório';
        }
        if (data.password == null || data.password == '') {
            errorList.password = 'Senha obrigatória';
        }
        if (Object.keys(errorList).length) {
            formRef.current.setErrors(errorList);
        } else {
            setSubmitIsLoading(true);
            signIn(data.username, data.password)
                .then(({ usuario }) => {
                    if (usuario.nivel == 0) {
                        navigation.replace('AdminNav');
                    } else if (usuario.nivel == 2) {
                        navigation.replace('ModeratorNav');
                    } else {
                        navigation.replace('UserNav');
                    }
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status == 401) {
                            formRef.current.setErrors({
                                password: 'Credenciais incorretos',
                            });
                        }
                    }
                    setSubmitIsLoading(false);
                });
        }
    };

    return (
        <ScrollView contentContainerStyle={sharedStyles.scrollAlign}>
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
                        editable={!submitIsLoading}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        name='password'
                        label='Senha'
                        placeholder='Senha'
                        type='password'
                        editable={!submitIsLoading}
                        style={{ marginBottom: 8 }}
                    />
                    {submitIsLoading ? (
                        <LoadingCircle />
                    ) : (
                        <CustomButton
                            title='Entrar'
                            style={{ marginBottom: 8 }}
                            onPress={() => formRef.current.submitForm()}
                        />
                    )}
                    <CustomButton
                        disabled={submitIsLoading}
                        title='Criar uma conta'
                        onPress={() => navigation.navigate('CreateAccount')}
                    />
                </Form>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formWrapper: {
        width: '60%',
        padding: 16,
    },
});

export default Login;
