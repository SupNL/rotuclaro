import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import Input from 'components/Input';
import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';
import { useAuth } from 'hooks/useAuth';
import ShowToast from 'utils/ShowToast';
import api from 'services/api';
import getUniqueId from 'utils/getUniqueId';

const CreateAccount = ({ navigation }) => {
    const formRef = useRef(null);
    const { signIn } = useAuth();

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
                        signIn(data.username, data.password)
                            .then(() => {
                                navigation.replace('UserNav');
                            })
                            .catch(() => {
                                ShowToast(
                                    'Ocorreu um erro inesperado. Tente novamente mais tarde.'
                                );
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        if (err.response.status == 429) {
                            ShowToast(
                                'Muitas requisições feitas. Aguarde antes de poder criar a conta.'
                            );
                        } else if (err.response.status == 409) {
                            ShowToast('Login em uso.');
                            formRef.current.setErrors({
                                username: 'Esse login já está em uso.',
                            });
                        } else {
                            ShowToast(
                                'Ocorreu um erro inesperado. Tente novamente mais tarde.'
                            );
                        }
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
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        name='username'
                        label='Nome de usuário'
                        placeholder='Informe um login'
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        name='password'
                        label='Senha'
                        placeholder='Informe a senha'
                        type='password'
                        style={{ marginBottom: 8 }}
                    />
                    <Input
                        name='confirmPassword'
                        label='Confirme a senha'
                        placeholder='Informe a mesma senha'
                        type='password'
                        style={{ marginBottom: 8 }}
                    />
                    <CustomButton
                        title='Criar conta'
                        style={{ marginBottom: 8 }}
                        onPress={() => formRef.current.submitForm()}
                    />
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
