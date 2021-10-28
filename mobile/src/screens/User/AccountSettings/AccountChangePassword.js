import React, { useRef, useState } from 'react';
import {  ScrollView, View } from 'react-native';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import {
    UserFormNoName,
    validateUserFormData,
} from 'screens/Admin/Users/components/UserForm';
import { useAuth } from 'hooks/useAuth';

const AccountChangePassword = ({ navigation }) => {
    const formRef = useRef(null);
    const scrollRef = useRef(null);

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const { usuario } = useAuth();

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = validateUserFormData(data, true, false, true);
        if (Object.keys(errorList).length) {
            formRef.current.setErrors(errorList);
            scrollRef.current.scrollTo({
                y: 0,
                animated: true,
            });
        } else {
            setSubmitIsLoading(true);
            api.post('/sessao', {
                login: usuario.login,
                senha: data.currentPassword,
            })
                .then(() => {
                    const submit_data = {
                        senha: data.senha,
                    };
                    return api.put(`/usuario/${usuario.id}`, submit_data);
                })
                .then(() => {
                    ShowToast('Atualizada com sucesso!');
                    navigation.goBack();
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

    return (
        <View style={sharedStyles.defaultScreen}>
            <ScrollView ref={scrollRef}>
                <UserFormNoName
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                    submitButtonLabel={'Atualizar dados'}
                    submitIsLoading={submitIsLoading}
                />
            </ScrollView>
        </View>
    );
};

export default AccountChangePassword;
