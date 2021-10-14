import CustomText from 'components/CustomText';
import LoadingCircle from 'components/LoadingCircle';
import SelectableComponent from 'components/SelectableComponent';
import React from 'react';
import { FlatList } from 'react-native';
const SelectListedComponents = ({
    components,
    selectedComponents,
    setSelectedComponents,
    submitIsLoading,
    isLoading,
    handleFetch,
    style,
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
                disabled={submitIsLoading}
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
            ListFooterComponent={isLoading && <LoadingCircle />}
            onEndReached={() => {
                if (isLoading) handleFetch();
            }}
            onEndReachedThreshold={0.1}
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
