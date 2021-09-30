import { ToastAndroid } from 'react-native';

const ShowToast = (message, position) => {
    position
        ? ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, position)
        : ToastAndroid.show(message, ToastAndroid.SHORT);
    return null;
};

export default ShowToast;
