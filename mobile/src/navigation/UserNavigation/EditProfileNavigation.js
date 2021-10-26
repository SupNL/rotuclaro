import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChangeBaseValue from 'screens/User/EditProfile/ChangeBaseValue';
import ChangeProfileOptions from 'screens/User/EditProfile/ChangeProfileOptions';
import MenuHeaderButton from 'components/MenuHeaderButton';
import ChangeCutValues from 'screens/User/EditProfile/ChangeCutValues';
import ChangeAlergenicComponent from 'screens/User/EditProfile/ChangeAlergenicComponent';
import { stackHeaderStyle } from 'shared/sharedStyles';

const EditProfileNavigation = () => {
    const ProfileStack = createStackNavigator();

    return (
        <ProfileStack.Navigator
            initialRouteName='ChangeProfileOptions'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Alterar perfil',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
                ...stackHeaderStyle
            })}
            detachInactiveScreens={false}
        >
            <ProfileStack.Screen
                name='ChangeProfileOptions'
                component={ChangeProfileOptions}
            />
            <ProfileStack.Screen
                name='ChangeBaseValue'
                component={ChangeBaseValue}
            />
            <ProfileStack.Screen
                name='ChangeCutValues'
                component={ChangeCutValues}
            />
            <ProfileStack.Screen
                name='ChangeAlergenicComponent'
                component={ChangeAlergenicComponent}
            />
        </ProfileStack.Navigator>
    );
};

export default EditProfileNavigation;
