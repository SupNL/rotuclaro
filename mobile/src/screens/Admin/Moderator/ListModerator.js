import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import api from 'services/api';
import ListItem from 'components/ListItem';
import CustomButton from 'components/CustomButton';
import axios from 'axios';
import ShowToast from 'utils/ShowToast';
import COLORS from 'shared/COLORS';
import ConfirmDialog from 'components/ConfirmDialog';

import { fetchModerators } from 'services/users/fetchModerator';
import BigErrorMessage from 'components/BigErrorMessage';

const ListModerator = ({ navigation }) => {
    const [moderators, setModerators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const source = axios.CancelToken.source();

    const loadModerators = () => {
        let lastId;
        if (moderators.length > 0)
            lastId = moderators[moderators.length - 1].id;
        fetchModerators(source.token, lastId)
            .then(([fetchedModerators, count]) => {
                if (moderators.length + fetchedModerators.length >= count)
                    setIsLoading(false);
                setModerators((old) => [...old, ...fetchedModerators]);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const handleDelete = (userId, userName) => {
        ConfirmDialog(
            `Deseja realmente desativar o moderador "${userName}"?`,
            'Essa operação é irreversível',
            () =>
                api.delete(`/usuario/${userId}`).then(() => {
                    setModerators((old) => old.filter((c) => c.id !== userId));
                    ShowToast('Usuário desativado');
                }),
            () => {}
        );
    };

    const handleEdit = (id) => {
        navigation.navigate('EditModerator', { moderatorId: id });
    };

    useEffect(() => {
        return () => {
            try {
                source.cancel();
            } catch (err) {
                if (axios.isCancel(err)) console.err(err);
            }
        };
    }, []);

    const renderItem = ({ item }) => {
        return (
            <ListItem
                id={item.id}
                label={item.nome}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
            />
        );
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadModerators();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setModerators([]);
            setIsLoading(true);
            setError(null);
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <CustomButton
                title='Cadastrar novo moderador'
                onPress={() => navigation.navigate('CreateModerator')}
            />
            {error ? (
                <BigErrorMessage>Ocorreu um erro na consulta</BigErrorMessage>
            ) : (
                <FlatList
                    data={moderators}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={
                        isLoading && (
                            <ActivityIndicator
                                style={{ marginVertical: 8 }}
                                color={COLORS.secondary}
                            />
                        )
                    }
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        if (isLoading) loadModerators();
                    }}
                />
            )}
        </View>
    );
};

export default ListModerator;
