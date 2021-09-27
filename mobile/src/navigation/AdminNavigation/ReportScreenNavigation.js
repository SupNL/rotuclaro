import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from 'screens/Admin/ReportScreen';
import MenuHeaderButton from 'components/MenuHeaderButton';

const ReportScreenNavigation = () => {
    const ReportScreenNav = createStackNavigator();

    return (
        <ReportScreenNav.Navigator
            initialRouteName='ReportSummary'
            screenOptions={({ navigation }) => ({
                headerTitle: 'Resumo',
                headerRight: () => <MenuHeaderButton navigation={navigation} />,
            })}
            detachInactiveScreens={false}
        >
            <ReportScreenNav.Screen name='ReportSummary' component={MainScreen} />
        </ReportScreenNav.Navigator>
    );
};

export default ReportScreenNavigation;
