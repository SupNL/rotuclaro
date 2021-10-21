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
import MenuAndSearch from 'components/MenuAndSearch';
import SearchModal from 'components/SearchModal';

const ListProduct = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visibleModal, setVisibleModal] = useState(false);
    const [name, setName] = useState(null);
    const [search, setSearch] = useState(false);

    const source = axios.CancelToken.source();

    const loadProducts = (lastName) => {
        fetchProducts(source.token, lastName, name)
            .then(([fetchedProducts, count]) => {
                const currentLength = products ? products.length : 0;
                if (currentLength + fetchedProducts.length >= count)
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
        navigation.setOptions({
            headerRight: () => (
                <MenuAndSearch
                    navigation={navigation}
                    onPress={() => setVisibleModal(true)}
                />
            ),
        });
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
                canDelete={item.permiteExclusao}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
            />
        );
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadProducts();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setProducts([]);
            setName(null);
            setError(null);
            setIsLoading(true);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if(search) {
            setProducts([]);
            setIsLoading(true);
            setError(null);
            loadProducts();
            setSearch(false);
        }
    }, [name, search]);

    return (
        <View style={{ flex: 1 }}>
            <SearchModal
                visible={visibleModal}
                setVisible={setVisibleModal}
                label='Nome do produto'
                setInfo={setName}
                toggleSearch={setSearch}
            />
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
                        if (isLoading)
                            loadProducts({
                                lastName:
                                    products.length > 0
                                        ? products[products.length - 1].nome
                                        : null,
                            });
                    }}
                />
            )}
        </View>
    );
};

export default ListProduct;
