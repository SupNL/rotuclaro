import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListAlergenicComponent from 'screens/Admin/AlergenicComponent/ListAlergenicComponent';
import MenuHeaderButton from 'components/MenuHeaderButton';
import { stackHeaderStyle } from 'shared/sharedStyles';

const AlergenicComponentNavigation = () => {
    const ComponentStack = createStackNavigator();

    return (
        <ComponentStack.Navigator
            initialRouteName='ListComponentsNav'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Componentes alergênicos',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
                ...stackHeaderStyle
            })}
            detachInactiveScreens={true}
        >
            <ComponentStack.Screen
                name='ListComponentsNav'
                component={ListAlergenicComponent}
            />
        </ComponentStack.Navigator>
    );
};

export default AlergenicComponentNavigation;
