import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import api from 'services/api';
import ListItem from 'components/ListItem';
import CustomButton from 'components/CustomButton';
import axios from 'axios';
import ShowToast from 'utils/ShowToast';
import COLORS from 'shared/COLORS';
import ConfirmDialog from 'components/ConfirmDialog';
import { fetchProducts } from '../../../services/product/fetchProduct';
import BigErrorMessage from 'components/BigErrorMessage';

const ListProduct = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const source = axios.CancelToken.source();

    const loadProducts = (tokenSource) => {
        let lastName;
        if (products.length > 0) lastName = products[products.length - 1].nome;
        fetchProducts(tokenSource, lastName)
            .then(([fetchedProducts, count]) => {
                if (products.length + fetchedProducts.length >= count)
                    setIsLoading(false);
                setProducts((old) => [...old, ...fetchedProducts]);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const handleDelete = (componentId, componentName) => {
        ConfirmDialog(
            `Deseja realmente excluir "${componentName}"?`,
            'Essa operação é irreversível',
            () =>
                api.delete(`/produto/${componentId}`).then(() => {
                    setProducts((old) =>
                        old.filter((c) => c.id !== componentId)
                    );
                    ShowToast('Produto excluído');
                }),
            () => {}
        );
    };

    const handleEdit = (id) => {
        navigation.navigate('EditProduct', {
            productId: id,
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
                id={item.id}
                label={item.nome}
                canDelete={false}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
            />
        );
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadProducts(source.token);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setProducts([]);
            setError(null);
            setIsLoading(true);
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <CustomButton
                title='Adicionar novo Produto'
                onPress={() => navigation.navigate('CreateProduct')}
            />
            {error ? (
                <BigErrorMessage>Ocorreu um erro na consulta</BigErrorMessage>
            ) : (
                <FlatList
                    data={products}
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
                        if (isLoading) loadProducts(source.token);
                    }}
                />
            )}
        </View>
    );
};

export default ListProduct;
