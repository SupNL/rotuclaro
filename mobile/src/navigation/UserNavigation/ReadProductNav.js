import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReadProduct from 'screens/User/ReadProduct/ReadProduct';
import BarCode from 'screens/User/ReadProduct/BarCode';

const ReadProductNav = () => {
    const ReadProductStack = createStackNavigator();

    return (
        <ReadProductStack.Navigator
            initialRouteName='DefineBaseValue'
            screenOptions={{ headerTitle: 'Ler produto'}}
        >
            <ReadProductStack.Screen
                name='ReadProduct'
                component={ReadProduct}
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
