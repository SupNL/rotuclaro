import React from 'react';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import ShowToast from 'utils/ShowToast';
import { useAuth } from 'hooks/useAuth';
import ProductNavigation from './ProductNavigation';
import SuggestionNavigation from './SuggestionNavigation';

const ModeratorNavigation = () => {
    const ModeratorDrawer = createDrawerNavigator();
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
        <ModeratorDrawer.Navigator
            initialRouteName='ProductScreenNav'
            drawerContent={renderDrawerContent}
            drawerPosition='right'
            detachInactiveScreens={true}
        >
                <ModeratorDrawer.Screen
                name='SuggestionNavigation'
                component={SuggestionNavigation}
                options={{ title: 'Sugestões' }}
            />
            <ModeratorDrawer.Screen
                name='ProductScreenNav'
                component={ProductNavigation}
                options={{ title: 'Produtos' }}
            />
        </ModeratorDrawer.Navigator>
    );
};

export default ModeratorNavigation;
