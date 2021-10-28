import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import axios from 'axios';
import COLORS from 'shared/COLORS';
import { fetchOneUser } from 'services/users/fetchUser';
import Header3 from 'components/Headers/Header3';
import { UserFormNoPassword, validateUserFormData } from 'screens/Admin/Users/components/UserForm';
import getUniqueId from 'utils/getUniqueId';
import { useAuth } from 'hooks/useAuth';

const AccountChangeData = ({ navigation, route }) => {
    const formRef = useRef(null);
    const scrollRef = useRef(null);

    const userId = route.params.userId;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fetchedUser, setFetchedUser] = useState();

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const source = axios.CancelToken.source();

    const { updateUserData } = useAuth();

    useEffect(() => {
        getUniqueId().then(id => {
            fetchOneUser(source.token, userId, id)
            .then((product) => {
                setFetchedUser(product);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => setIsLoading(false));
        });

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
        const errorList = validateUserFormData(data, false);
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
            };
            api.put(`/usuario/${userId}`, submit_data)
                .then(() => {
                    ShowToast('Atualizado com sucesso!');
                    updateUserData(submit_data.nome, submit_data.login);
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
                <Header3 style={sharedStyles.errorHeader}>Ocorreu um erro ao consultar seus dados</Header3>
            ) : isLoading ? (
                <ActivityIndicator color={COLORS.secondary} />
            ) : (
                fetchedUser && (
                    <ScrollView ref={scrollRef}>
                        <UserFormNoPassword
                            formRef={formRef}
                            handleSubmit={handleSubmit}
                            submitButtonLabel={'Atualizar dados'}
                            submitIsLoading={submitIsLoading}
                            initialData={{
                                nome : fetchedUser.nome,
                                login : fetchedUser.login,
                            }}
                        />
                    </ScrollView>
                )
            )}
        </View>
    );
};

export default AccountChangeData;
