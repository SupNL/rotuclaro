import CustomText from 'components/CustomText';
import SelectableComponent from 'components/SelectableComponent';
import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import COLORS from 'shared/COLORS';

const SelectListedComponents = ({
    components,
    selectedComponents,
    setSelectedComponents,
    isLoading,
    handleFetch,
    style
}) => {

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

    const renderComponentItem = ({ item }) => {
        return (
            <SelectableComponent
                key={item.id}
                onPressAction={onComponentPress}
                componentId={item.id}
                componentName={item.nome}
                isSelected={selectedComponents.find(
                    (current) => current.id === item.id
                )}
            />
        );
    };

    return (
        <FlatList
            data={components ? components : []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderComponentItem}
            style={{ ...style }}
            ListFooterComponent={
                isLoading && (
                    <ActivityIndicator
                        color={COLORS.secondary}
                        style={{ marginBottom: 8 }}
                    />
                )
            }
            onEndReached={() => {
                if (isLoading) handleFetch();
            }}
            ListEmptyComponent={
                !isLoading && (
                    <CustomText
                        style={{
                            marginBottom: 8,
                            fontWeight: 'bold',
                        }}
                    >
                        No momento, não há nenhum componente alergênico
                        cadastrado para seleção.
                    </CustomText>
                )
            }
        />
    );
};

export default SelectListedComponents;
