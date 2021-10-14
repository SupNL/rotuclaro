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
import ProductNavigation from './ProductNavigation';
import ModeratorNavigation from './ModeratorNavigation';
import UserNavigation from './UserNavigation';
import SuggestionNavigation from './SuggestionNavigation';

const AdminNavigation = () => {
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
            />
            <AdminDrawer.Screen
                name='AlergenicComponentScreenNav'
                component={AlergenicComponentNavigation}
                options={{ title: 'Componentes alergênicos' }}
            />
            <AdminDrawer.Screen
                name='ProductScreenNav'
                component={ProductNavigation}
                options={{ title: 'Produtos' }}
            />
            <AdminDrawer.Screen
                name='ModeratorScreenNav'
                component={ModeratorNavigation}
                options={{ title: 'Moderadores' }}
            />
            <AdminDrawer.Screen
                name='UserNavigation'
                component={UserNavigation}
                options={{ title: 'Usuários' }}
            />
            <AdminDrawer.Screen
                name='SuggestionNavigation'
                component={SuggestionNavigation}
                options={{ title: 'Sugestões' }}
            />
        </AdminDrawer.Navigator>
    );
};

export default AdminNavigation;
