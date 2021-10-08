import React, { useEffect, useState } from 'react';
import Header from 'components/Header';
import { StyleSheet, View } from 'react-native';

import CustomText from 'components/CustomText';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import { useAuth } from 'hooks/useAuth';
import ShowToast from 'utils/ShowToast';
import { Perfil } from 'model/Perfil';
import SelectListedComponents from 'components/SelectListedComponents';
import axios from 'axios';
import { fetchAlergenicComponents } from 'services/alergenicComponents/fetchAlergenicComponent';
import api from 'services/api';
const ChangeAlergenicComponent = ({ navigation }) => {
    const { perfil, updateProfile } = useAuth();

    const [components, setComponents] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState(
        perfil.componentesAlergenicos.map((c) => ({ id: c.id }))
    );
    const [isLoading, setIsLoading] = useState(true);

    const source = axios.CancelToken.source();

    const handleSubmit = () => {
        const submitData = {
            componentesAlergenicos: selectedComponents.map((c) => ({
                id: c.id,
            })),
        };
        api.put('/perfil', submitData)
            .then((res) => {
                const newProfile = res.data;
                const dummyProfile = new Perfil(newProfile);
                updateProfile(dummyProfile).then(() => {
                    ShowToast('Perfil atualizado');
                    navigation.goBack();
                });
            })
            .catch((err) => {
                console.log({ err });
            });
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

    const fetchComponents = () => {
        let lastName;
        if (components.length > 0)
            lastName = components[components.length - 1].nome;
        fetchAlergenicComponents(source.token, lastName).then(
            ([fetchedComponents, count]) => {
                if (components.length + fetchedComponents.length >= count)
                    setIsLoading(false);
                setComponents((old) => [...old, ...fetchedComponents]);
            }
        );
    };

    return (
        <View style={sharedStyles.defaultScreen}>
            <Header>Alterar componentes alergênicos</Header>
            <CustomText style={styles.text}>
                Caso você possua algum tipo de alergia, você precisa marcar os
                componentes abaixo que causam reações alérgicas.
            </CustomText>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <CustomButton
                    title='Cancelar'
                    onPress={() => navigation.goBack()}
                    style={{ marginRight: 16, flex: 1 }}
                />
                <CustomButton
                    title='Salvar'
                    onPress={handleSubmit}
                    style={{ flex: 1 }}
                />
            </View>
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

export default ChangeAlergenicComponent;
