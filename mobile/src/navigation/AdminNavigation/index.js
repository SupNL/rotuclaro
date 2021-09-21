import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import MainScreenNavigation from './MainScreenNavigation';
import ShowToast from 'utils/ShowToast';
import { useAuth } from 'hooks/useAuth';
import AlergenicComponentNavigation from './AlergenicComponentNavigation';

const AdminNavigation = () => {
    const AdminDrawer = createDrawerNavigator();
    const { signOut} = useAuth();

    const renderDrawerContent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
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
        <AdminDrawer.Navigator
            initialRouteName='MainScreen'
            drawerContent={renderDrawerContent}
            detachInactiveScreens={true}
        >
            <AdminDrawer.Screen
                name='MainScreenNav'
                component={MainScreenNavigation}
                options={{ title: 'Tela principal' }}
            />
            <AdminDrawer.Screen
                name='AlergenicComponentScreenNav'
                component={AlergenicComponentNavigation}
                options={{ title: 'Componentes alergênicos' }}
            />
        </AdminDrawer.Navigator>
    );
};

export default AdminNavigation;
