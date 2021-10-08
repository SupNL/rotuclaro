import React from 'react';
import { View } from 'react-native';

import sharedStyles from 'shared/sharedStyles';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from 'components/CustomButton';

const ChangeProfileOptions = ({ navigation }) => {
    return (
        <View style={sharedStyles.defaultScreen}>
            <ScrollView>
                <CustomButton
                    title='Alterar valor de referência'
                    onPress={() => navigation.navigate('ChangeBaseValue')}
                    style={{ marginBottom: 16 }}
                />
                <CustomButton
                    title='Alterar valores de corte'
                    onPress={() => navigation.navigate('ChangeCutValues')}
                    style={{ marginBottom: 16 }}
                />
                <CustomButton
                    title='Alterar componentes alergênicos'
                    onPress={() => navigation.navigate('ChangeAlergenicComponent')}
                />
            </ScrollView>
        </View>
    );
};

export default ChangeProfileOptions;
