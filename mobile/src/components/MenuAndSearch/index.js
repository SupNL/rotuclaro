import MenuHeaderButton from 'components/MenuHeaderButton';
import SearchButton from 'components/SearchButton';
import React from 'react';
import { StyleSheet, View } from 'react-native';


const MenuAndSearch = ({ onPress, navigation }) => {
    return (
        <View style={styles.wrapper}>
            <SearchButton onPress={onPress} />
            <MenuHeaderButton navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper : {
        flexDirection: 'row'
    }
});

export default MenuAndSearch;
