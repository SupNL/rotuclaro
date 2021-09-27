import { ToastAndroid } from 'react-native';

const ShowToast = (message, position) => {
    console.log(position);
    position
        ? ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, position)
        : ToastAndroid.show(message, ToastAndroid.SHORT);
    return null;
};

export default ShowToast;
