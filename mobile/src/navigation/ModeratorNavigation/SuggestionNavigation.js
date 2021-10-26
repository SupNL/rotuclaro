import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuHeaderButton from 'components/MenuHeaderButton';
import ListSuggestion from 'screens/Moderator/Suggestions/ListSuggestion';
import CreateProduct from 'screens/Moderator/Suggestions/CreateProduct';
import { stackHeaderStyle } from 'shared/sharedStyles';

const SuggestionNavigation = () => {
    const ComponentStack = createStackNavigator();

    return (
        <ComponentStack.Navigator
            initialRouteName='ListSuggestion'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Sugestões',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
                ...stackHeaderStyle
            })}
            detachInactiveScreens={true}
        >
            <ComponentStack.Screen
                name='ListSuggestion'
                component={ListSuggestion}
            />
            <ComponentStack.Screen 
                name='CreateProduct'
                component={CreateProduct}
                options={{
                    headerTitle: 'Cadastrar produto'
                }}
            />
        </ComponentStack.Navigator>
    );
};

export default SuggestionNavigation;
