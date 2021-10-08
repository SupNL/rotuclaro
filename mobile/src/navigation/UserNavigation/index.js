import React from 'react';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

import ReadProductNav from './ReadProductNav';
import CreateProfileNavigation from './CreateProfileNavigation';
import { useAuth } from 'hooks/useAuth';
import ShowToast from 'utils/ShowToast';
import EditProfileNavigation from './EditProfileNavigation';

const UserNavigation = () => {
    const UserDrawer = createDrawerNavigator();
    const { perfil, signOut } = useAuth();

    let initialRoute = 'CreateProfileNav';

    if (perfil) {
        initialRoute = 'ReadProductNav';
    }

    const renderDrawerContent = (props) => {
        const { state, ...rest } = props;
        const newState = { ...state };
        newState.routes = newState.routes.filter(
            (item) => item.name !== 'CreateProfileNav'
        );

        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList state={newState} {...rest} />
                <DrawerItem
                    label='Sair'
                    onPress={() => {
                        ShowToast('Desautenticado.');
                        signOut();
                    }}
                />
            </DrawerContentScrollView>
        );
    };

    return (
        <UserDrawer.Navigator
            initialRouteName={initialRoute}
            drawerContent={renderDrawerContent}
            drawerPosition='right'
            detachInactiveScreens={true}
        >
            <UserDrawer.Screen
                name='ReadProductNav'
                component={ReadProductNav}
                options={{ title: 'Ler produto' }}
            />
            <UserDrawer.Screen
                name='EditProfileNavigation'
                component={EditProfileNavigation}
                options={{ title: 'Alterar perfil' }}
            />
            {/* não clickáveis */}
            <UserDrawer.Screen
                name='CreateProfileNav'
                component={CreateProfileNavigation}
                options={{ swipeEnabled: false }}
            />
        </UserDrawer.Navigator>
    );
};

export default UserNavigation;
