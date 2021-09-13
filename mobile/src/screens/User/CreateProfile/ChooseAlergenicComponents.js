import React, { useState, useCallback, useEffect } from 'react';
import Header from 'components/Header';
import { StyleSheet, View, ScrollView } from 'react-native';
import axios from 'axios';

import CustomText from 'components/CustomText';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import ConfirmDialog from 'components/ConfirmDialog';
import SelectableComponent from 'components/SelectableComponent';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';

const ChooseAlergenicComponents = ({ navigation, route }) => {
    const [components, setComponents] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const routeParams = route.params;

    const fetchComponents = (tokenSource) => {
        api.get('/componente_alergenico', { cancelToken: tokenSource }).then(
            (response) => {
                const data = response.data;
                const componentesFromApi = data.map((componente) => {
                    return {
                        id: componente.id,
                        name: componente.nome,
                    };
                });
                setComponents(componentesFromApi);
                setIsLoading(false);
            }
        );
    };

    const handleSubmit = () => {
        const limitValues = routeParams.limitValues;
        const submitData = {
            gramas: routeParams.baseValue,
            limiteMedioKcal: limitValues['kcal-slider'][0],
            limiteAltoKcal: limitValues['kcal-slider'][1],
            limiteMedioCarboidratos: limitValues['carbo-slider'][0],
            limiteAltoCarboidratos: limitValues['carbo-slider'][1],
            limiteMedioAcucares: limitValues['sugar-slider'][0],
            limiteAltoAcucares: limitValues['sugar-slider'][1],
            limiteMedioGordurasTotais: limitValues['fat-slider'][0],
            limiteAltoGordurasTotais: limitValues['fat-slider'][1],
            limiteMedioGordurasTrans: limitValues['fat-trans-slider']
                ? limitValues['fat-trans-slider'][0]
                : 0,
            limiteAltoGordurasTrans: limitValues['fat-trans-slider']
                ? limitValues['fat-trans-slider'][1]
                : 0,
            limiteMedioGordurasSaturadas: limitValues['fat-saturated-slider']
                ? limitValues['fat-saturated-slider'][0]
                : 0,
            limiteAltoGordurasSaturadas: limitValues['fat-saturated-slider']
                ? limitValues['fat-saturated-slider'][1]
                : 0,
            limiteMedioSodio: limitValues['sodium-slider'][0],
            limiteAltoSodio: limitValues['sodium-slider'][1],
            componentesAlergenicos:
                selectedComponents.length > 0
                    ? selectedComponents.map((c) => ({
                          id: c.id,
                      }))
                    : undefined,
        };
        api.post('/perfil', submitData)
            .then(() => navigation.navigate('ReadProductNav'))
            .catch((err) => {
                if (err.response.status == 409) {
                    ShowToast(
                        'Perfil já existente, não era para você estar naquela tela!'
                    );
                    navigation.navigate('ReadProductNav');
                } else if (err.response.status == 429) {
                    ShowToast('Muitas requisições feitas, aguarde um pouco.');
                } else {
                    ShowToast(
                        'Ocorreu um erro inesperado, tente novamente mais tarde.'
                    );
                }
            });
    };

    const handleButtonConfirmation = () => {
        ConfirmDialog(
            'Confirmar decisão?',
            'Os valores podem ser alterados a qualquer momento.',
            () => handleSubmit(),
            () => {}
        );
    };

    const onComponentPress = (componentId) => {
        const selectedIndex = selectedComponents.findIndex(
            (item) => item.id === componentId
        );
        if (selectedIndex !== -1) {
            setSelectedComponents((old) => {
                return [
                    ...old.slice(0, selectedIndex),
                    ...old.slice(selectedIndex + 1),
                ];
            });
        } else {
            const element = components.find((item) => item.id === componentId);
            setSelectedComponents((old) => {
                return [...old, element];
            });
        }
    };

    const renderComponents = useCallback(() => {
        if (components.length == 0) {
            return (
                <CustomText
                    style={{
                        marginBottom: 8,
                        fontWeight: 'bold',
                    }}
                >
                    No momento, não há nenhum componente alergênico cadastrado
                    para seleção.
                </CustomText>
            );
        }
        const list = components.map((item) => {
            return (
                <SelectableComponent
                    key={item.id}
                    onPressAction={onComponentPress}
                    componentId={item.id}
                    componentName={item.name}
                    isSelected={selectedComponents.find(
                        (current) => current.id === item.id
                    )}
                />
            );
        });
        return list;
    }, [components, selectedComponents]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        fetchComponents(source.token);

        return () => {
            try {
                source.cancel();
            } catch (err) {
                console.log(axios.isCancel(err));
            }
        };
    }, []);

    return (
        <ScrollView>
            <View style={sharedStyles.defaultScreen}>
                <Header>Selecione os componentes alergênicos</Header>
                <CustomText style={styles.text}>
                    Caso você possua algum tipo de alergia, você precisa marcar
                    os componentes abaixo que causam reações alérgicas.
                </CustomText>
                {isLoading ? (
                    <View style={styles.text}>
                        <CustomText>Carregando...</CustomText>
                    </View>
                ) : (
                    <View>{renderComponents()}</View>
                )}

                <CustomButton
                    title='Continuar'
                    onPress={handleButtonConfirmation}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
    },
});

export default ChooseAlergenicComponents;
