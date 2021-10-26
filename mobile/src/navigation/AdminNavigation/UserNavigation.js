import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuHeaderButton from 'components/MenuHeaderButton';
import ListUser from 'screens/Admin/Users/ListUser';
import EditUser from 'screens/Admin/Users/EditUser';
import { stackHeaderStyle } from 'shared/sharedStyles';

const UserNavigation = () => {
    const ComponentStack = createStackNavigator();

    return (
        <ComponentStack.Navigator
            initialRouteName='ListUser'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Usuários',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
                ...stackHeaderStyle
            })}
            detachInactiveScreens={true}
        >
            <ComponentStack.Screen
                name='ListUser'
                component={ListUser}
            />
            <ComponentStack.Screen 
                name='EditUser'
                component={EditUser}
                options={{
                    headerTitle: 'Alterar usuário'
                }}
            />
        </ComponentStack.Navigator>
    );
};

export default UserNavigation;
