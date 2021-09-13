import { ToastAndroid } from 'react-native';

const ShowToast = (message) => {
    ToastAndroid.show(
        message,
        ToastAndroid.SHORT,
    );
    return null;
};

export default ShowToast;
