import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import sharedStyles from 'shared/sharedStyles';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import ProductForm, {
    formValidation,
} from 'screens/Admin/Product/components/ProductForm';

const CreateProduct = ({ navigation, route }) => {
    const productCode = route.params.productCode;
    const formRef = useRef(null);
    const scrollRef = useRef(null);

    const [selectedComponents, setSelectedComponents] = useState([]);

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

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
                    }
                    setSubmitIsLoading(false);
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
                    submitIsLoading={submitIsLoading}
                    submitButtonLabel={'Cadastrar produto'}
                    codeIsDisabled={true}
                    initialData={{
                        codigo: productCode,
                    }}
                />
            </ScrollView>
        </View>
    );
};

export default CreateProduct;
