import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuHeaderButton from 'components/MenuHeaderButton';
import ListProduct from 'screens/Moderator/Product/ListProduct';
import CreateProduct from 'screens/Moderator/Product/CreateProduct';
import EditProduct from 'screens/Moderator/Product/EditProduct';

const ProductNavigation = () => {
    const ComponentStack = createStackNavigator();

    return (
        <ComponentStack.Navigator
            initialRouteName='ListProduct'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Produtos',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
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
