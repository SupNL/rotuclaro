import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from 'screens/Admin/MainScreen';

const MainScreenNavigation = () => {
    const MainScreenNav = createStackNavigator();

    return (
        <MainScreenNav.Navigator
            initialRouteName='MainScreen'
            screenOptions={{ headerTitle: 'Tela principal'}}
            detachInactiveScreens={false}
        >
            <MainScreenNav.Screen
                name='MainScreen'
                component={MainScreen}
            />
        </MainScreenNav.Navigator>
    );
};

export default MainScreenNavigation;
