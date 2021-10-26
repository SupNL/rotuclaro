import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DefineBaseValue from 'screens/User/CreateProfile/DefineBaseValue';
import DefineCutValues from 'screens/User/CreateProfile/DefineCutValues';
import ChooseAlergenicComponents from 'screens/User/CreateProfile/ChooseAlergenicComponents';
import { stackHeaderStyle } from 'shared/sharedStyles';

const CreateProfileNavigation = () => {
    const ProfileStack = createStackNavigator();

    return (
        <ProfileStack.Navigator
            initialRouteName='DefineBaseValue'
            screenOptions={{ headerTitle: 'Crie seu perfil', ...stackHeaderStyle}}
            detachInactiveScreens={false}
        >
            <ProfileStack.Screen
                name='DefineBaseValue'
                component={DefineBaseValue}
            />
            <ProfileStack.Screen
                name='DefineCutValues'
                component={DefineCutValues}
            />
            <ProfileStack.Screen
                name='ChooseAlergenicComponents'
                component={ChooseAlergenicComponents}
            />
        </ProfileStack.Navigator>
    );
};

export default CreateProfileNavigation;
