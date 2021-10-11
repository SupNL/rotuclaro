import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import ModeratorForm, { formValidation } from './components/ModeratorForm';

const CreateModerator = ({ navigation }) => {
    const formRef = useRef(null);
    const scrollRef = useRef(null);

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = formValidation(data, true);
        if (Object.keys(errorList).length) {
            formRef.current.setErrors(errorList);
            scrollRef.current.scrollTo({
                y: 0,
                animated: true,
            });
        } else {
            const submit_data = {
                nome: data.nome,
                login: data.login,
                senha: data.senha,
                nivel : 'moderador'
            };
            api.post('/usuario', submit_data, {
                headers: {
                    idunico: '123123',
                },
            })
                .then(() => {
                    ShowToast('Moderador cadastrado com sucesso!');
                    navigation.goBack();
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.status == 409) {
                            scrollRef.current.scrollTo({
                                y: 0,
                                animated: true,
                            });
                            formRef.current.setErrors({
                                login: 'Login em uso.',
                            });
                        }
                        console.log(err.response);
                    }
                });
        }
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            <ScrollView ref={scrollRef}>
                <ModeratorForm
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                    submitButtonLabel={'Cadastrar'}
                />
            </ScrollView>
        </View>
    );
};

export default CreateModerator;
