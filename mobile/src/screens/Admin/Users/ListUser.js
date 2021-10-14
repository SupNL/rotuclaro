import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import api from 'services/api';
import ListItem from 'components/ListItem';
import axios from 'axios';
import ShowToast from 'utils/ShowToast';
import COLORS from 'shared/COLORS';
import ConfirmDialog from 'components/ConfirmDialog';

import { fetchUsers } from 'services/users/fetchUser';
import BigErrorMessage from 'components/BigErrorMessage';

const ListUser = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const source = axios.CancelToken.source();

    const loadUsers = () => {
        let lastId;
        if (users.length > 0) lastId = users[users.length - 1].id;
        fetchUsers(source.token, lastId)
            .then(([fetchedUsers, count]) => {
                if (users.length + fetchedUsers.length >= count)
                    setIsLoading(false);
                setUsers((old) => [...old, ...fetchedUsers]);
            })
            .catch((err) => {
                setError({
                    status: err?.response?.status,
                });
            });
    };

    const handleDelete = (userId, userName) => {
        ConfirmDialog(
            `Deseja realmente desativar o usuário "${userName}"?`,
            'Essa operação é irreversível',
            () =>
                api.delete(`/usuario/${userId}`).then(() => {
                    setUsers((old) => old.filter((c) => c.id !== userId));
                    ShowToast('Usuário desativado');
                }),
            () => {}
        );
    };

    const handleEdit = (id) => {
        navigation.navigate('EditUser', { userId: id });
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
            loadUsers();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setUsers([]);
            setIsLoading(true);
            setError(null);
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            {error ? (
                <BigErrorMessage>
                    Ocorreu um erro na consulta
                </BigErrorMessage>
            ) : (
                <FlatList
                    data={users}
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
                        if (isLoading) loadUsers();
                    }}
                />
            )}
        </View>
    );
};

export default ListUser;
