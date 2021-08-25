import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginNavigation from './LoginNavigation';
import UserNavigation from './UserNavigation';

const MainNavigation = ({ children }) => {
    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='LoginNav'
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name='LoginNav' component={LoginNavigation} />
                <Stack.Screen
                    name='UserNav'
                    component={UserNavigation}
                />
            </Stack.Navigator>
            {children}
        </NavigationContainer>
    );
};

export default MainNavigation;
