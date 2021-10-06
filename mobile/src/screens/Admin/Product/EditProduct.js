import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import axios from 'axios';
import { fetchOneProduct } from 'services/product/fetchProduct';
import Header2 from 'components/Headers/Header2';
import COLORS from 'shared/COLORS';
import ProductForm, { formValidation } from './components/ProductForm';

const EditProduct = ({ navigation, route }) => {
    const formRef = useRef(null);
    const scrollRef = useRef(null);

    const productId = route.params.productId;

    const [selectedComponents, setSelectedComponents] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [fetchedProduct, setFetchedProduct] = useState();
    const [isError, setIsError] = useState();

    const productSource = axios.CancelToken.source();

    useEffect(() => {
        fetchOneProduct(productSource.token, productId, 100)
            .then((product) => {
                setFetchedProduct(product);
                setSelectedComponents(product.componentesAlergenicos);
            })
            .catch((err) => {
                if (err.response) {
                    setIsError(err.response.status);
                } else {
                    setIsError(-1);
                }
            })
            .finally(() => setIsLoading(false));

        return () => {
            try {
                productSource.cancel();
            } catch (err) {
                if (axios.isCancel(err)) console.err(err);
            }
        };
    }, []);

    const handleSubmit = (data) => {
        formRef.current.setErrors({});
        const errorList = formValidation(data);
        if (Object.keys(errorList).length) {
            formRef.current.setErrors(errorList);
            scrollRef.current.scrollTo({
                y: 0,
                animated: true,
            });
        } else {
            const submit_data = {
                ...data,
                componentesAlergenicos : selectedComponents.map(c => {
                    return { id : c.id };
                })
            };
            api.put(`/produto/${productId}`, submit_data)
                .then(() => {
                    ShowToast('Produto alterado com sucesso!');
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
                                codigo: 'Código em uso.',
                            });
                        }
                    }
                    console.log({ err });
                });
        }
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            {isLoading ? (
                <ActivityIndicator color={COLORS.secondary} />
            ) : isError ? (
                <Header2>Ocorreu um erro na consulta do produto</Header2>
            ) : (
                fetchedProduct && (
                    <ScrollView ref={scrollRef}>
                        <ProductForm
                            formRef={formRef}
                            handleSubmit={handleSubmit}
                            submitButtonLabel={'Alterar produto'}
                            initialComponents={fetchedProduct.componentesAlergenicos}
                            selectedComponents={selectedComponents}
                            setSelectedComponents={setSelectedComponents}
                            initialData={{
                                codigo: fetchedProduct.codigo,
                                nome: fetchedProduct.nome,
                                liquido: fetchedProduct.liquido,
                                gramasOuMlPorcao:
                                    fetchedProduct.gramasOuMlPorcao.toString(),
                                kcal: fetchedProduct.kcal.toString(),
                                carboidratos:
                                    fetchedProduct.carboidratos.toString(),
                                acucares: fetchedProduct.acucares.toString(),
                                gorduras: fetchedProduct.gorduras.toString(),
                                gordurasSaturadas:
                                    fetchedProduct.gordurasSaturadas.toString(),
                                gordurasTrans:
                                    fetchedProduct.gordurasTrans.toString(),
                                sodio: fetchedProduct.sodio.toString(),
                                proteinas: fetchedProduct.proteinas.toString(),
                                fibras: fetchedProduct.fibras.toString(),
                                ingredientes: fetchedProduct.ingredientes,
                            }}
                        />
                    </ScrollView>
                )
            )}
        </View>
    );
};

export default EditProduct;
