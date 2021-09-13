import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginNavigation from './LoginNavigation';
import UserNavigation from './UserNavigation';
import { AuthProvider, useAuth } from 'hooks/useAuth';
import AdminNavigation from './AdminNavigation';
import { useEffect } from 'react';
import { useState } from 'react';
import { View } from 'react-native';

const Navigator = () => {
    const { user } = useAuth();
    const Stack = createStackNavigator();
    const [initialRoute, setInitialRoute] = useState(null);
    
    useEffect(() => {
        if (!user) return;
        if (user.unauthenticated) {
            setInitialRoute('LoginNav');
        } else if (user.nivel == 0) {
            setInitialRoute('AdminNav');
        } else {
            setInitialRoute('UserNav');
        }
    }, [user]);

    if (initialRoute != null) {
        return <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name='LoginNav' component={LoginNavigation} />
            <Stack.Screen name='UserNav' component={UserNavigation} />
            <Stack.Screen name='AdminNav' component={AdminNavigation} />
        </Stack.Navigator>;
    }

    return <View></View>;
};

const MainNavigation = ({ children }) => {
    const navRef = useRef();

    return (
        <NavigationContainer ref={navRef}>
            <AuthProvider navRef={navRef}>
                <Navigator />
                {children}
            </AuthProvider>
        </NavigationContainer>
    );
};

export default MainNavigation;
