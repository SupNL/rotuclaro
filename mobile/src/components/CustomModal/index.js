import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

const CustomModal = ({ children, visible, onRequestClose, ...rest }) => {
    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={visible}
            onRequestClose={onRequestClose}
            {...rest}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalScreen}>{children}</View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        backgroundColor: '#00000060',
        width: '100%',
        height: '100%',
    },
    modalScreen: {
        width: '84%',
        height: 'auto',
        maxHeight: '90%',
        padding: 16,
        alignSelf: 'center',
        backgroundColor: 'white',
        marginTop: 'auto',
        marginBottom: 'auto',
        borderRadius: 10
    },
});

export default CustomModal;
