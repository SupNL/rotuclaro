import React from 'react';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import ReportScreenNavigation from './ReportScreenNavigation';
import AlergenicComponentNavigation from './AlergenicComponentNavigation';
import ShowToast from 'utils/ShowToast';
import { useAuth } from 'hooks/useAuth';

const AdminNavigation = ({ renderMenuButton }) => {
    const AdminDrawer = createDrawerNavigator();
    const { signOut } = useAuth();

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
            drawerPosition='right'
            detachInactiveScreens={true}
        >
            <AdminDrawer.Screen
                name='MainScreenNav'
                component={ReportScreenNavigation}
                options={{ title: 'Relatórios' }}
                renderMenuButton={renderMenuButton}
            />
            <AdminDrawer.Screen
                name='AlergenicComponentScreenNav'
                component={AlergenicComponentNavigation}
                options={{ title: 'Componentes alergênicos' }}
                renderMenuButton={renderMenuButton}
            />
        </AdminDrawer.Navigator>
    );
};

export default AdminNavigation;
