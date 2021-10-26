import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReadProduct from 'screens/User/ReadProduct/ReadProduct';
import BarCode from 'screens/User/ReadProduct/BarCode';
import MenuHeaderButton from 'components/MenuHeaderButton';
import ProductDetails from 'screens/User/ReadProduct/ProductDetails';
import { stackHeaderStyle } from 'shared/sharedStyles';

const ReadProductNav = () => {
    const ReadProductStack = createStackNavigator();

    return (
        <ReadProductStack.Navigator
            initialRouteName='DefineBaseValue'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Ler produto',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
                ...stackHeaderStyle
            })}
        >
            <ReadProductStack.Screen
                name='ReadProduct'
                component={ReadProduct}
            />
            <ReadProductStack.Screen
                name='ProductDetails'
                component={ProductDetails}
                options={{
                    headerShown : false
                }}
            />
            <ReadProductStack.Screen
                name='BarCode'
                component={BarCode}
                options={{
                    headerShown : false
                }}
            />
        </ReadProductStack.Navigator>
    );
};

export default ReadProductNav;
