import { Alert } from 'react-native';

const ConfirmDialog = (
    title,
    message,
    onConfirm,
    onCancel,
    confirmTitle,
    cancelTitle
) => {
    Alert.alert(title, message, [
        {
            text: cancelTitle ? cancelTitle : 'Não',
            onPress: onCancel,
            style: 'cancel',
        },
        { text: confirmTitle ? confirmTitle : 'Sim', onPress: onConfirm },
    ]);
};

export default ConfirmDialog;
