import React, { useState, useCallback, useEffect } from 'react';
import Header from 'components/Header';
import { StyleSheet, View, ScrollView } from 'react-native';

import CustomText from 'components/CustomText';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import ConfirmDialog from 'components/ConfirmDialog';
import SelectableComponent from 'components/SelectableComponent';

const ChooseAlergenicComponents = ({ navigation }) => {
    const [components, setComponents] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComponents = () => {
        return setTimeout(() => {
            const data = [
                { id: 0, name: 'Leite (Lactose)' },
                { id: 1, name: 'Glúten' },
                { id: 2, name: 'Amendoim' },
                { id: 3, name: 'Nozes' },
                { id: 4, name: 'Ovo (Albumina)' },
                { id: 5, name: 'Soja' },
                { id: 6, name: 'Frutos do mar (Camarão, lula, etc)' },
                { id: 7, name: 'Corantes' },
            ];
            setComponents(data);
            setIsLoading(false);
        }, 1500);
    };

    const handleSubmit = () => {
        ConfirmDialog(
            'Confirmar decisão?',
            'Os valores podem ser alterados a qualquer momento.',
            () => navigation.navigate('ReadProductNav'),
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
        const timeout = fetchComponents();

        return () => {
            clearTimeout(timeout);
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

                <CustomButton title='Continuar' onPress={handleSubmit} />
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
