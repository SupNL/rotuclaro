import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Form } from '@unform/mobile';

import Input from 'components/Input';
import CustomButton from 'components/CustomButton';
import sharedStyles from 'shared/sharedStyles';

const Login = ({ navigation }) => {
    const formRef = useRef(null);

    const handleSubmit = (data) => {
        console.log(data);
        navigation.replace('UserNav');
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
                    style={{ box: { marginBottom: 8 } }}
                />
                <Input
                    name='password'
                    label='Senha'
                    placeholder='Senha'
                    type='password'
                    style={{ box: { marginBottom: 8 } }}
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
