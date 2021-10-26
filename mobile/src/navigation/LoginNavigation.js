import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from 'screens/Login';
import CreateAccount from 'screens/CreateAccount';
import { stackHeaderStyle } from 'shared/sharedStyles';

const LoginNavigation = () => {
    const LoginStack = createStackNavigator();

    return (
        <LoginStack.Navigator screenOptions={{...stackHeaderStyle}} >
            <LoginStack.Screen name='Login' component={Login} />
            <LoginStack.Screen
                name='CreateAccount'
                component={CreateAccount}
                options={{ title: 'Criar uma conta' }}
            />
        </LoginStack.Navigator>
    );
};

export default LoginNavigation;
