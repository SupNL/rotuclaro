import React from 'react';
import { View } from 'react-native';
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

const UserNavigation = () => {
    const UserDrawer = createDrawerNavigator();
    const { profile, signOut } = useAuth();
    
    let initialRoute = 'CreateProfileNav';

    if(profile) {
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
            detachInactiveScreens={true}
        >
            <UserDrawer.Screen
                name='CreateProfileNav'
                customDrawerContent={() => <View></View>}
                component={CreateProfileNavigation}
                options={{ swipeEnabled: false }}
            />
            <UserDrawer.Screen
                name='ReadProductNav'
                component={ReadProductNav}
                options={{ title: 'Ler produto' }}
            />
        </UserDrawer.Navigator>
    );
};

export default UserNavigation;
