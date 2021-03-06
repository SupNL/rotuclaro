import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import axios from 'axios';
import COLORS from 'shared/COLORS';
import { fetchOneUser } from 'services/users/fetchUser';
import Header3 from 'components/Headers/Header3';
import UserForm, { validateUserFormData } from 'screens/Admin/Users/components/UserForm';

const EditModerator = ({ navigation, route }) => {
    const formRef = useRef(null);
    const scrollRef = useRef(null);

    const moderatorId = route.params.moderatorId;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fetchedModerator, setFetchedModerator] = useState();

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const source = axios.CancelToken.source();

    useEffect(() => {
        fetchOneUser(source.token, moderatorId, 100)
            .then((product) => {
                setFetchedModerator(product);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => setIsLoading(false));

        return () => {
            try {
                source.cancel();
            } catch (err) {
                if (axios.isCancel(err)) console.err(err);
            }
        };
    }, []);

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = validateUserFormData(data);
        if (Object.keys(errorList).length) {
            formRef.current.setErrors(errorList);
            scrollRef.current.scrollTo({
                y: 0,
                animated: true,
            });
        } else {
            setSubmitIsLoading(true);
            const submit_data = {
                nome : data.nome,
                login : data.login,
                senha : data.senha ? data.senha : undefined,
            };
            api.put(`/usuario/${moderatorId}`, submit_data)
                .then(() => {
                    ShowToast('Moderador alterado com sucesso!');
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
                    }
                    setSubmitIsLoading(false);
                });
        }
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            {error ? (
                <Header3 style={sharedStyles.errorHeader}>Ocorreu um erro na consulta do moderador</Header3>
            ) : isLoading ? (
                <ActivityIndicator color={COLORS.secondary} />
            ) : (
                fetchedModerator && (
                    <ScrollView ref={scrollRef}>
                        <UserForm
                            formRef={formRef}
                            handleSubmit={handleSubmit}
                            submitButtonLabel={'Alterar dados'}
                            submitIsLoading={submitIsLoading}
                            initialData={{
                                nome : fetchedModerator.nome,
                                login : fetchedModerator.login,
                            }}
                        />
                    </ScrollView>
                )
            )}
        </View>
    );
};

export default EditModerator;
