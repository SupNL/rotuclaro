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
import SelectListedComponents from 'components/SelectListedComponents';
import CustomModal from 'components/CustomModal';
import LoadingCircle from 'components/LoadingCircle';
import BigErrorMessage from 'components/BigErrorMessage';
import { fetchAlergenicComponents } from 'services/alergenicComponents/fetchAlergenicComponent';

const ChooseAlergenicComponents = ({ navigation, route }) => {
    const [components, setComponents] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const source = axios.CancelToken.source();

    const { updateProfile, signOut } = useAuth();

    const routeParams = route.params;

    const loadingModal = (
        <CustomModal visible={submitIsLoading} onRequestClose={() => {}}>
            {submitError ? (
                <BigErrorMessage>
                    Ocorreu um erro. Você será desautenticado.
                </BigErrorMessage>
            ) : (
                <LoadingCircle />
            )}
        </CustomModal>
    );

    const loadComponents = () => {
        let lastName;
        if (components.length > 0)
            lastName = components[components.length - 1].nome;
        fetchAlergenicComponents(source.token, lastName)
            .then(([fetchedComponents, count]) => {
                if (components.length + fetchedComponents.length >= count)
                    setIsLoading(false);
                setComponents((old) => [...old, ...fetchedComponents]);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const handleSubmit = () => {
        setSubmitIsLoading(true);
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
                    : [],
        };
        api.post('/perfil', submitData)
            .then((res) => {
                ShowToast('Perfil cadastrado!');
                updateProfile(res.data).then(() =>
                    navigation.navigate('ReadProductNav')
                );
            })
            .catch((err) => {
                if (err.response && err.response.status == 409) {
                    ShowToast('Perfil já cadastrado.');
                    navigation.navigate('ReadProductNav');
                } else {
                    setSubmitError(true);
                    setTimeout(() => {
                        signOut();
                    }, 3000);
                }
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
        loadComponents();

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
            {loadingModal}
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
            {error ? (
                <BigErrorMessage>Ocorreu um erro na consulta</BigErrorMessage>
            ) : (
                <SelectListedComponents
                    components={components}
                    selectedComponents={selectedComponents}
                    setSelectedComponents={setSelectedComponents}
                    isLoading={isLoading}
                    handleFetch={loadComponents}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
    },
});

export default ChooseAlergenicComponents;
