import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import sharedStyles from 'shared/sharedStyles';
import CustomText from 'components/CustomText';
import api from 'services/api';
import ListItem from 'components/ListItem';
import CustomButton from 'components/CustomButton';

const ListAlergenicComponent = () => {
    const [components, setComponents] = useState([]);

    useEffect(() => {
        api.get('/componente_alergenico').then((res) => {
            setComponents(res.data);
            // setComponents([
            //     { nome : 'asd', id : 1 },
            //     { nome : 'asd', id : 2 },
            //     { nome : 'asd', id : 3 },
            //     { nome : 'asd', id : 4 },
            //     { nome : 'asd', id : 5 },
            //     { nome : 'asd', id : 6 },
            //     { nome : 'asd', id : 7 },
            //     { nome : 'asd', id : 8 },
            //     { nome : 'asd', id : 9 },
            //     { nome : 'asd', id : 10 },
            //     { nome : 'asd', id : 11 },
            // ]);
        });
    }, []);

    const renderItem = ({ item }) => {
        return <ListItem label={item.nome} />;
    };

    return (
        <View style={{ flex : 1 }}>
            <CustomButton title='Adicionar novo Componente Alergênico' />
            <FlatList
                data={components}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

// const styles = StyleSheet.create({
//     text: {
//         fontSize: 24,
//         marginBottom: 8,
//     },
// });

export default ListAlergenicComponent;
