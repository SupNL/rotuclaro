import React, { useRef, useState } from 'react';
import { ToastAndroid, View } from 'react-native';

import sharedStyles from 'shared/sharedStyles';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from 'components/CustomButton';
import COLORS from 'shared/COLORS';
import { useAuth } from 'hooks/useAuth';
import CustomModal from 'components/CustomModal';
import CustomText from 'components/CustomText';
import Input from 'components/Input';
import { Form } from '@unform/mobile';
import LoadingCircle from 'components/LoadingCircle';
import api from 'services/api';

const AccountSettingsOptions = ({ navigation }) => {
    const { usuario, signOut } = useAuth();
    const formRef = useRef();

    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [disableModalVisible, setDisableModalVisible] = useState(false);
    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const handleSubmit = (data) => {
        setSubmitIsLoading(true);
        formRef.current.setErrors({});
        if (data.currentPassword == null || data.currentPassword == '') {
            formRef.current.setErrors({ currentPassword: 'Obrigatória' });
            setSubmitIsLoading(false);
        } else {
            api.post('/sessao', {
                login: usuario.login,
                senha: data.currentPassword,
            })
                .then(() => {
                    return api.delete(`/usuario/${usuario.id}`);
                })
                .then(() => {
                    ToastAndroid.showWithGravity(
                        'Sua conta foi permanentemente desativada. Obrigado por utilizar a RotuClaro!',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP
                    );
                    signOut();
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status == 401) {
                            formRef.current.setErrors({
                                currentPassword: 'Senha incorreta',
                            });
                        }
                    }
                    setSubmitIsLoading(false);
                });
        }
    };

    const DisableAccountModal = (
        <CustomModal
            visible={disableModalVisible}
            onRequestClose={() => setDisableModalVisible(false)}
        >
            <CustomText style={{ marginBottom: 8 }}>
                Confirme a sua senha antes de desativar sua conta.
            </CustomText>
            <Form ref={formRef} onSubmit={handleSubmit}>
                <Input
                    name='currentPassword'
                    label='Senha atual'
                    placeholder='Informe sua senha'
                    type='password'
                    editable={!submitIsLoading}
                    style={{ marginBottom: 8 }}
                />
                {submitIsLoading ? (
                    <LoadingCircle />
                ) : (
                    <CustomButton
                        title='Desativar minha conta'
                        style={{ marginBottom: 8 }}
                        color={COLORS.error}
                        onPress={() => formRef.current.submitForm()}
                    />
                )}
            </Form>
            <CustomButton
                title='Cancelar'
                onPress={() => {
                    setDisableModalVisible(false);
                }}
            />
        </CustomModal>
    );

    const WarnDisableAccountModal = (
        <CustomModal
            visible={warningModalVisible}
            onRequestClose={() => setWarningModalVisible(false)}
        >
            <CustomText style={{ marginBottom: 8 }}>
                Desativar sua conta é uma ação irreversível! Você irá perder o
                acesso ao seu perfil e seu nome de usuário não poderá ser
                utilizado.
            </CustomText>
            <CustomText>
                Você deseja continuar para desativar sua conta?
            </CustomText>
            <CustomButton
                title='Sim, estou ciente'
                onPress={() => {
                    setWarningModalVisible(false);
                    setDisableModalVisible(true);
                }}
                color={COLORS.error}
                style={{ marginVertical: 16 }}
            />
            <CustomButton
                title='Não! Mudei de ideia'
                onPress={() => {
                    setWarningModalVisible(false);
                }}
            />
        </CustomModal>
    );

    return (
        <View style={sharedStyles.defaultScreen}>
            {WarnDisableAccountModal}
            {DisableAccountModal}
            <ScrollView>
                <CustomButton
                    title='Alterar meus dados'
                    onPress={() =>
                        navigation.navigate('AccountChangeData', {
                            userId: usuario.id,
                        })
                    }
                    style={{ marginBottom: 16 }}
                />
                <CustomButton
                    title='Alterar minha senha'
                    onPress={() => navigation.navigate('AccountChangePassword')}
                    style={{ marginBottom: 16 }}
                />
                <CustomButton
                    title='Desativar minha conta'
                    color={COLORS.error}
                    onPress={() => setWarningModalVisible(true)}
                />
            </ScrollView>
        </View>
    );
};

export default AccountSettingsOptions;
