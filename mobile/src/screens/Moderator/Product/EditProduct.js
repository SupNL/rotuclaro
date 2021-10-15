import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import axios from 'axios';
import { fetchOneProduct } from 'services/product/fetchProduct';
import ProductForm, { formValidation } from 'screens/Admin/Product/components/ProductForm';
import BigErrorMessage from 'components/BigErrorMessage';
import LoadingCircle from 'components/LoadingCircle';

const EditProduct = ({ navigation, route }) => {
    const formRef = useRef(null);
    const scrollRef = useRef(null);

    const productId = route.params.productId;

    const [selectedComponents, setSelectedComponents] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [fetchedProduct, setFetchedProduct] = useState();
    const [error, setError] = useState();

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const productSource = axios.CancelToken.source();

    useEffect(() => {
        fetchOneProduct(productSource.token, productId, 100)
            .then((product) => {
                setFetchedProduct(product);
                setSelectedComponents(product.componentesAlergenicos);
            })
            .catch((err) => {
                setError(err);
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
            setSubmitIsLoading(true);
            const submit_data = {
                ...data,
                componentesAlergenicos: selectedComponents.map((c) => {
                    return { id: c.id };
                }),
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
                    setSubmitIsLoading(false);
                });
        }
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            {error ? (
                <BigErrorMessage>Ocorreu um erro na consulta do produto</BigErrorMessage>
            ) : isLoading ? (
                <LoadingCircle />
            ) : (
                fetchedProduct && (
                    <ScrollView ref={scrollRef}>
                        <ProductForm
                            formRef={formRef}
                            handleSubmit={handleSubmit}
                            submitButtonLabel={'Alterar produto'}
                            initialComponents={
                                fetchedProduct.componentesAlergenicos
                            }
                            selectedComponents={selectedComponents}
                            setSelectedComponents={setSelectedComponents}
                            submitIsLoading={submitIsLoading}
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
