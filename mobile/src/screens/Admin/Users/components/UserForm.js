import React from 'react';
import { Form } from '@unform/mobile';
import { StyleSheet } from 'react-native';
import CustomButton from 'components/CustomButton';
import Input from 'components/Input';
import LoadingCircle from 'components/LoadingCircle';

export const validateUserFormData = (data, requirePassword, requireNames, supplyOldPassword) => {
    const errorList = {};
    const reg = new RegExp('^[a-zA-Z0-9@]*$');

    if (requireNames) {
        if (data.nome == null || data.nome == '') {
            errorList.nome = 'Obrigatório';
        }
        if (data.login == null || data.login == '') {
            errorList.login = 'Obrigatório';
        } else if (!reg.test(data.username)) {
            errorList.username =
                'Não adicione espaço ou caracteres especiais (o \'@\' é permitido)';
        }
    }
    if (requirePassword) {
        if(supplyOldPassword) {
            if (data.currentPassword == null || data.currentPassword == '') {
                errorList.currentPassword = 'Obrigatória';
            }
        }
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

export const UserFormNoPassword = ({
    formRef,
    handleSubmit,
    submitButtonLabel,
    submitIsLoading,
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
                placeholder='Seu nome'
                editable={!submitIsLoading}
                style={{ marginBottom: 4 }}
            />
            <Input
                name='login'
                label='Nome de usuário'
                placeholder='Seu login'
                editable={!submitIsLoading}
                style={{ marginBottom: 8 }}
            />
            {submitIsLoading ? (
                <LoadingCircle />
            ) : (
                <CustomButton
                    title={submitButtonLabel}
                    style={{ marginBottom: 8 }}
                    onPress={() => formRef.current.submitForm()}
                />
            )}
        </Form>
    );
};

export const UserFormNoName = ({
    formRef,
    handleSubmit,
    submitButtonLabel,
    submitIsLoading,
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
                name='currentPassword'
                label='Senha atual'
                placeholder='Informe sua senha'
                type='password'
                editable={!submitIsLoading}
                style={{ marginBottom: 8 }}
            />
            <Input
                name='senha'
                label='Nova senha'
                placeholder='Informe a nova senha'
                type='password'
                editable={!submitIsLoading}
                style={{ marginBottom: 8 }}
            />
            <Input
                name='confirmarSenha'
                label='Confirme a senha'
                placeholder='Confirme a nova senha'
                type='password'
                editable={!submitIsLoading}
                style={{ marginBottom: 8 }}
            />
            {submitIsLoading ? (
                <LoadingCircle />
            ) : (
                <CustomButton
                    title={submitButtonLabel}
                    style={{ marginBottom: 8 }}
                    onPress={() => formRef.current.submitForm()}
                />
            )}
        </Form>
    );
};

const UserForm = ({
    formRef,
    handleSubmit,
    submitButtonLabel,
    submitIsLoading,
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
                editable={!submitIsLoading}
                style={{ marginBottom: 4 }}
            />
            <Input
                name='login'
                label='Nome de usuário'
                placeholder='Login do moderador'
                editable={!submitIsLoading}
                style={{ marginBottom: 8 }}
            />
            <Input
                name='senha'
                label='Senha'
                placeholder='Informe a senha'
                type='password'
                editable={!submitIsLoading}
                style={{ marginBottom: 8 }}
            />
            <Input
                name='confirmarSenha'
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
                    title={submitButtonLabel}
                    style={{ marginBottom: 8 }}
                    onPress={() => formRef.current.submitForm()}
                />
            )}
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

export default UserForm;
