import React from 'react';
import { View } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';

import ReadProductNav from './ReadProductNav';
import CreateProfileNavigation from './CreateProfileNavigation';

const UserNavigation = () => {
    const UserDrawer = createDrawerNavigator();

    const renderDrawerContent = (props) => {
        const { state, ...rest } = props;
        const newState = { ...state };
        newState.routes = newState.routes.filter(
            (item) => item.name !== 'CreateProfileNav'
        );
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList state={newState} {...rest} />
            </DrawerContentScrollView>
        );
    };

    return (
        <UserDrawer.Navigator
            initialRouteName='ReadProductNav'
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
                options={{ title : 'Ler produto' }}
            />
        </UserDrawer.Navigator>
    );
};

export default UserNavigation;
