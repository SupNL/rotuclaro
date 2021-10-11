import React from 'react';
import { Form } from '@unform/mobile';
import { StyleSheet } from 'react-native';
import CustomButton from 'components/CustomButton';
import Input from 'components/Input';

export const formValidation = (data, requirePassword) => {
    const errorList = {};
    const reg = new RegExp('^[a-zA-Z0-9@]*$');

    if (data.nome == null || data.nome == '') {
        errorList.nome = 'Obrigatório';
    }
    if (data.login == null || data.login == '') {
        errorList.login = 'Obrigatório';
    } else if (!reg.test(data.username)) {
        errorList.username =
            'Não adicione espaço ou caracteres especiais (o \'@\' é permitido)';
    }
    if (requirePassword) {
        if (data.senha == null || data.senha == '') {
            errorList.senha = 'Obrigatória';
        } else if (data.confirmarSenha == null || data.confirmarSenha == '') {
            errorList.confirmarSenha = 'Confirme a senha';
        } else if (data.confirmarSenha !== data.senha) {
            errorList.confirmarSenha = 'As senhas estão diferentes';
        }
    } else {
        if (
            data.senha != null &&
            data.senha != '' &&
            (data.confirmarSenha == null || data.confirmarSenha == '')
        ) {
            errorList.confirmarSenha = 'Confirme a senha';
        } else if (
            data.confirmarSenha != null &&
            data.confirmarSenha != '' &&
            (data.senha == null || data.senha == '')
        ) {
            errorList.senha = 'Informe a senha';
        } else if (data.confirmarSenha !== data.senha) {
            errorList.confirmarSenha = 'As senhas estão diferentes';
        }
    }

    return errorList;
};

const ModeratorForm = ({
    formRef,
    handleSubmit,
    submitButtonLabel,
    initialData,
}) => {
    return (
        <Form
            initialData={initialData}
            ref={formRef}
            onSubmit={handleSubmit}
            style={styles.formWrapper}
        >
            <Input
                name='nome'
                label='Nome'
                placeholder='Nome do moderador'
                style={{ marginBottom: 4 }}
            />
            <Input
                name='login'
                label='Nome de usuário'
                placeholder='Login do moderador'
                style={{ marginBottom: 8 }}
            />
            <Input
                name='senha'
                label='Senha'
                placeholder='Informe a senha'
                type='password'
                style={{ marginBottom: 8 }}
            />
            <Input
                name='confirmarSenha'
                label='Confirme a senha'
                placeholder='Informe a mesma senha'
                type='password'
                style={{ marginBottom: 8 }}
            />
            <CustomButton
                title={submitButtonLabel}
                style={{ marginBottom: 8 }}
                onPress={() => formRef.current.submitForm()}
            />
        </Form>
    );
};

const styles = StyleSheet.create({
    formWrapper: {
        flex: 1,
        padding: 16,
        width: '100%',
    },
});

export default ModeratorForm;
