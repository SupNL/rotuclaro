import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListAlergenicComponent from 'screens/Admin/AlergenicComponent/ListAlergenicComponent';

const AlergenicComponentNavigation = () => {
    const ComponentStack = createStackNavigator();

    return (
        <ComponentStack.Navigator
            initialRouteName='ListComponentsNav'
            screenOptions={{ headerTitle: 'Componentes alergênicos'}}
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
