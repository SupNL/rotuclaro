import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import Input from 'components/Input';
import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';
import { useAuth } from 'hooks/useAuth';
import api from 'services/api';
import getUniqueId from 'utils/getUniqueId';
import LoadingCircle from 'components/LoadingCircle';

const CreateAccount = ({ navigation }) => {
    const formRef = useRef(null);
    const { signIn } = useAuth();

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = {};
        const reg = new RegExp('^[a-zA-Z0-9@]*$');

        if (data.name == null || data.name == '') {
            errorList.name = 'Nome obrigatório';
        }

        if (data.username == null || data.username == '') {
            errorList.username = 'Nome de usuário obrigatório';
        } else if (!reg.test(data.username)) {
            errorList.username =
                'Não adicione espaço ou caracteres especiais (o \'@\' é permitido)';
        }

        if (data.password == null || data.password == '') {
            errorList.password = 'Senha obrigatória';
        }

        if (data.confirmPassword == null || data.confirmPassword == '') {
            errorList.confirmPassword = 'Confirme a senha';
        } else if (data.confirmPassword !== data.password) {
            errorList.confirmPassword = 'As senhas estão diferentes';
        }

        if (Object.keys(errorList).length) {
            formRef.current.setErrors(errorList);
        } else {
            setSubmitIsLoading(true);
            const submit_data = {
                nome: data.name,
                login: data.username,
                senha: data.password,
            };
            getUniqueId().then((id) => {
                api.post('/usuario', submit_data, {
                    headers: {
                        idUnico: id,
                    },
                })
                    .then(() => {
                        signIn(data.username, data.password).then(() => {
                            navigation.replace('UserNav');
                        });
                    })
                    .catch((err) => {
                        if (err.response) {
                            if (err.response.status == 409) {
                                formRef.current.setErrors({
                                    username: 'Esse login já está em uso.',
                                });
                            } else if (err.response.status == 429) {
                                formRef.current.setErrors({
                                    username: 'Você criou uma conta recentemente. Tente novamente depois.',
                                });
                            }
                        }
                        setSubmitIsLoading(false);
                    });
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
                        name='name'
                        label='Seu nome'
                        placeholder='Informe seu nome'
                        editable={!submitIsLoading}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        name='username'
                        label='Nome de usuário'
                        placeholder='Informe um login'
                        editable={!submitIsLoading}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        name='password'
                        label='Senha'
                        placeholder='Informe a senha'
                        type='password'
                        editable={!submitIsLoading}
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        name='confirmPassword'
                        label='Confirme a senha'
                        placeholder='Informe a mesma senha'
                        type='password'
                        editable={!submitIsLoading}
                        style={{ marginBottom: 8 }}
                    />
                    {submitIsLoading ? (
                        <LoadingCircle />
                    ) : (
                        <CustomButton
                            title='Criar conta'
                            style={{ marginBottom: 8 }}
                            onPress={() => formRef.current.submitForm()}
                        />
                    )}
                    <CustomButton
                        title='Voltar'
                        onPress={() => navigation.goBack()}
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

export default CreateAccount;
