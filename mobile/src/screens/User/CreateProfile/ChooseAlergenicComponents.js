import React, { useState, useEffect } from 'react';
import Header from 'components/Header';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';

import CustomText from 'components/CustomText';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import ConfirmDialog from 'components/ConfirmDialog';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import { useAuth } from 'hooks/useAuth';
import { useRef } from 'react';
import SelectListedComponents from 'components/SelectListedComponents';

const ChooseAlergenicComponents = ({ navigation, route }) => {
    const [components, setComponents] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const source = axios.CancelToken.source();
    const totalCount = useRef(-1);
    const page = useRef(1);

    const { updateProfile } = useAuth();

    const routeParams = route.params;

    const fetchComponents = () => {
        let url = '/componente_alergenico';
        if(components.length > 0) {
            const length = components.length;
            const lastName = components[length - 1].nome;
            url += `?last_name=${lastName}`;
        }
        api.get(url, {
            cancelToken: source.token,
        })
            .then((response) => {
                const data = response.data;
                totalCount.current = response.headers['x-total-count'];
                setComponents((old) => {
                    const newArray = [...old, ...data];
                    if (newArray.length == totalCount.current)
                        setIsLoading(false);
                    return newArray;
                });
                page.current += 1;
            })
            .catch((err) => {
                console.log({ err });
            });
    };

    const handleSubmit = () => {
        const limitValues = routeParams.limitValues;
        const submitData = {
            gramas: routeParams.gramValue,
            ml: routeParams.mlValue,
            limiteMedioKcal: limitValues['kcal-slider'][0] / 100,
            limiteAltoKcal: limitValues['kcal-slider'][1] / 100,
            limiteMedioCarboidratos: limitValues['carbo-slider'][0] / 100,
            limiteAltoCarboidratos: limitValues['carbo-slider'][1] / 100,
            limiteMedioAcucares: limitValues['sugar-slider'][0] / 100,
            limiteAltoAcucares: limitValues['sugar-slider'][1] / 100,
            limiteMedioGordurasTotais: limitValues['fat-slider'][0] / 100,
            limiteAltoGordurasTotais: limitValues['fat-slider'][1] / 100,
            limiteMedioGordurasTrans: limitValues['fat-trans-slider']
                ? limitValues['fat-trans-slider'][0] / 100
                : 0,
            limiteAltoGordurasTrans: limitValues['fat-trans-slider']
                ? limitValues['fat-trans-slider'][1] / 100
                : 0,
            limiteMedioGordurasSaturadas: limitValues['fat-saturated-slider']
                ? limitValues['fat-saturated-slider'][0] / 100
                : 0,
            limiteAltoGordurasSaturadas: limitValues['fat-saturated-slider']
                ? limitValues['fat-saturated-slider'][1] / 100
                : 0,
            limiteMedioSodio: limitValues['sodium-slider'][0] / 100,
            limiteAltoSodio: limitValues['sodium-slider'][1] / 100,
            componentesAlergenicos:
                selectedComponents.length > 0
                    ? selectedComponents.map((c) => ({
                          id: c.id,
                      }))
                    : undefined,
        };
        api.post('/perfil', submitData)
            .then((res) => {
                ShowToast('Perfil cadastrado!');
                updateProfile(res.data).then(() =>
                    navigation.navigate('ReadProductNav')
                );
            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.status == 409) {
                        ShowToast('Perfil já existente.');
                        navigation.navigate('ReadProductNav');
                    }
                }
                console.error({ err });
            });
    };

    const handleButtonConfirmation = () => {
        ConfirmDialog(
            'Confirmar decisão?',
            'Seu perfil pode ser alterado a qualquer momento.',
            () => handleSubmit(),
            () => {}
        );
    };

    useEffect(() => {
        fetchComponents();

        return () => {
            try {
                source.cancel();
            } catch (err) {
                console.log(axios.isCancel(err));
            }
        };
    }, []);

    return (
        <View style={sharedStyles.defaultScreen}>
            <Header>Selecione os componentes alergênicos</Header>
            <CustomText style={styles.text}>
                Caso você possua algum tipo de alergia, você precisa marcar os
                componentes abaixo que causam reações alérgicas.
            </CustomText>
            <CustomButton
                title='Continuar'
                onPress={handleButtonConfirmation}
                style={{ marginBottom: 8 }}
            />
            <SelectListedComponents
                components={components}
                selectedComponents={selectedComponents}
                setSelectedComponents={setSelectedComponents}
                isLoading={isLoading}
                handleFetch={fetchComponents}
           />
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
    },
});

export default ChooseAlergenicComponents;
