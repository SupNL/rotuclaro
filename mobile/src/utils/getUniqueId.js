import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from 'expo-secure-store';

const getUniqueId = () => {
    return new Promise(resolve => {
        SecureStore.getItemAsync('rotuclaro_uniqueid').then((id) => {
            if (!id) {
                id = uuidv4();
                SecureStore.setItemAsync(
                    'rotuclaro_uniqueid',
                    JSON.stringify(id)
                ).then(() => resolve(id));
            } else {
                resolve(id);
            }
        });
    });
};

export default getUniqueId;
