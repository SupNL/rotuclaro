import CustomText from 'components/CustomText';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Trash2, Edit } from 'react-native-feather';
import COLORS from 'shared/COLORS';

const ListItem = ({
    id,
    label,
    canDelete = true,
    handleDelete,
    canEdit = true,
    handleEdit,
}) => {
    return (
        <View style={styles.wrapper}>
            <View
                style={{
                    flex: 10,
                }}
            >
                <CustomText style={styles.text}>{label}</CustomText>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 4,
                }}
            >
                {canEdit && (
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => handleEdit(id, label)}
                        style={{
                            ...styles.touchable,
                            backgroundColor: COLORS.secondary,
                        }}
                    >
                        <Edit stroke={COLORS.white} />
                    </TouchableOpacity>
                )}
                {canDelete && (
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => handleDelete(id, label)}
                        style={{
                            ...styles.touchable,
                            backgroundColor: COLORS.error,
                        }}
                    >
                        <Trash2 stroke={COLORS.white} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.white,
        padding: 20,
        width: '100%',

        borderBottomWidth: 1,
        borderColor: COLORS.black,
        borderStyle: 'solid',

        flexDirection: 'row',
        alignItems: 'center',
    },
    touchable: {
        padding: 6,
        borderRadius: 100,
    },
    text: {
        fontSize: 18,
    },
});

export default ListItem;
