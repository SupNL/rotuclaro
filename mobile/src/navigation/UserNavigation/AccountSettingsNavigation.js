import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuHeaderButton from 'components/MenuHeaderButton';
import { stackHeaderStyle } from 'shared/sharedStyles';
import AccountSettingsOptions from 'screens/User/AccountSettings/AccountSettingsOptions';
import AccountChangeData from 'screens/User/AccountSettings/AccountChangeData';
import AccountChangePassword from 'screens/User/AccountSettings/AccountChangePassword';

const AccountSettingsNavigation = () => {
    const AccountStack = createStackNavigator();

    return (
        <AccountStack.Navigator
            initialRouteName='AccountSettingsOptions'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Minha conta',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
                ...stackHeaderStyle
            })}
            detachInactiveScreens={false}
        >
            <AccountStack.Screen
                name='AccountSettingsOptions'
                component={AccountSettingsOptions}
            />
            <AccountStack.Screen
                name='AccountChangeData'
                component={AccountChangeData}
            />
            <AccountStack.Screen
                name='AccountChangePassword'
                component={AccountChangePassword}
            />
        </AccountStack.Navigator>
    );
};

export default AccountSettingsNavigation;
