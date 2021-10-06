import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import ProductForm, { formValidation } from './components/ProductForm';

const CreateProduct = ({ navigation }) => {
    const formRef = useRef(null);
    const scrollRef = useRef(null);

    const [selectedComponents, setSelectedComponents] = useState([]);

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
                componentesAlergenicos: selectedComponents.map((c) => {
                    return { id: c.id };
                }),
            };
            api.post('/produto', submit_data)
                .then(() => {
                    ShowToast('Produto cadastrado com sucesso!');
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
                                codigo: 'Código já cadastrado.',
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
                <ProductForm
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                    selectedComponents={selectedComponents}
                    setSelectedComponents={setSelectedComponents}
                    submitButtonLabel={'Cadastrar produto'}
                />
            </ScrollView>
        </View>
    );
};

export default CreateProduct;
