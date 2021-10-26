import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuHeaderButton from 'components/MenuHeaderButton';
import ListModerator from 'screens/Admin/Moderator/ListModerator';
import EditModerator from 'screens/Admin/Moderator/EditModerator';
import CreateModerator from 'screens/Admin/Moderator/CreateModerator';
import { stackHeaderStyle } from 'shared/sharedStyles';

const ModeratorNavigation = () => {
    const ComponentStack = createStackNavigator();

    return (
        <ComponentStack.Navigator
            initialRouteName='ListModerator'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Moderadores',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
                ...stackHeaderStyle
            })}
            detachInactiveScreens={true}
        >
            <ComponentStack.Screen
                name='ListModerator'
                component={ListModerator}
            />
            <ComponentStack.Screen 
                name='CreateModerator'
                component={CreateModerator}
                options={{
                    headerTitle: 'Cadastrar moderador'
                }}
            />
            <ComponentStack.Screen 
                name='EditModerator'
                component={EditModerator}
                options={{
                    headerTitle: 'Alterar moderador'
                }}
            />
        </ComponentStack.Navigator>
    );
};

export default ModeratorNavigation;
