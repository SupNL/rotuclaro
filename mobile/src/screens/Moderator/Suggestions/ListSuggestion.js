import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';

import api from 'services/api';
import ListItem from 'components/ListItem';
import axios from 'axios';
import ShowToast from 'utils/ShowToast';
import ConfirmDialog from 'components/ConfirmDialog';
import BigErrorMessage from 'components/BigErrorMessage';
import { fetchSuggestions } from 'services/suggestions/fetchSuggestion';
import LoadingCircle from 'components/LoadingCircle';

const ListSuggestion = ({ navigation }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const source = axios.CancelToken.source();

    const loadSuggestions = (tokenSource) => {
        let lastDate, lastCount;
        if (suggestions.length > 0) {
            const last = suggestions[suggestions.length - 1];
            lastDate = last.dataPrimeiraSugestao;
            lastCount = last.vezesSugeridas;
        }
            
        fetchSuggestions(tokenSource, lastDate, lastCount)
            .then(([fetchedSuggestions, count]) => {
                if (suggestions.length + fetchedSuggestions.length >= count)
                    setIsLoading(false);
                setSuggestions((old) => [...old, ...fetchedSuggestions]);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const handleDelete = (suggestionCode) => {
        ConfirmDialog(
            `Deseja realmente excluir a sugestão "${suggestionCode}"?`,
            'Essa operação é irreversível e a contagem de sugestões será apagada',
            () =>
                api.delete(`/sugestao/${suggestionCode}`).then(() => {
                    setSuggestions((old) =>
                        old.filter((c) => c.codigo !== suggestionCode)
                    );
                    ShowToast('Sugestão excluída');
                }),
            () => {}
        );
    };

    const handleEdit = (code) => {
        navigation.navigate('CreateProduct', {
            productCode: code,
        });
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
                id={item.codigo}
                label={`${item.codigo}`}
                description={item.vezesSugeridas > 1 ? `Sugerido ${item.vezesSugeridas} vezes` : 'Sugerido 1 vez'}
                useCreateInstead={true}
                canDelete={false}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
            />
        );
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadSuggestions(source.token);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setSuggestions([]);
            setError(null);
            setIsLoading(true);
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            {error ? (
                <BigErrorMessage>Ocorreu um erro na consulta</BigErrorMessage>
            ) : (
                <FlatList
                    data={suggestions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.codigo}
                    ListFooterComponent={isLoading && <LoadingCircle />}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        if (isLoading) loadSuggestions(source.token);
                    }}
                />
            )}
        </View>
    );
};

export default ListSuggestion;
