import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DefineBaseValue from 'screens/CreateProfile/DefineBaseValue';
import DefineCutValues from 'screens/CreateProfile/DefineCutValues';
import ChooseAlergenicComponents from 'screens/CreateProfile/ChooseAlergenicComponents';

const CreateProfileNavigation = () => {
    const ProfileStack = createStackNavigator();

    return (
        <ProfileStack.Navigator
            initialRouteName='DefineBaseValue'
            screenOptions={{ headerTitle: 'Crie seu perfil'}}
            detachInactiveScreens={false}
        >
            <ProfileStack.Screen
                name='DefineBaseValue'
                component={DefineBaseValue}
                options={{
                    
                }}
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
