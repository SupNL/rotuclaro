import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainScreenNavigation from './MainScreenNavigation';

const AdminNavigation = () => {
    const AdminDrawer = createDrawerNavigator();

    return (
        <AdminDrawer.Navigator
            initialRouteName='MainScreen'
            detachInactiveScreens={true}
        >
            <AdminDrawer.Screen
                name='MainScreenNav'
                component={MainScreenNavigation}
                options={{ title: 'Tela principal' }}
            />
        </AdminDrawer.Navigator>
    );
};

export default AdminNavigation;
