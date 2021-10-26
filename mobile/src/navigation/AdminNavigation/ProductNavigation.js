import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuHeaderButton from 'components/MenuHeaderButton';
import ListProduct from 'screens/Admin/Product/ListProduct';
import CreateProduct from 'screens/Admin/Product/CreateProduct';
import EditProduct from 'screens/Admin/Product/EditProduct';
import { stackHeaderStyle } from 'shared/sharedStyles';

const ProductNavigation = () => {
    const ComponentStack = createStackNavigator();

    return (
        <ComponentStack.Navigator
            initialRouteName='ListProduct'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Produtos',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
                ...stackHeaderStyle
            })}
            detachInactiveScreens={true}
        >
            <ComponentStack.Screen
                name='ListProduct'
                component={ListProduct}
            />
            <ComponentStack.Screen 
                name='CreateProduct'
                component={CreateProduct}
                options={{
                    headerTitle: 'Cadastrar produto'
                }}
            />
            <ComponentStack.Screen 
                name='EditProduct'
                component={EditProduct}
                options={{
                    headerTitle: 'Alterar produto'
                }}
            />
        </ComponentStack.Navigator>
    );
};

export default ProductNavigation;
