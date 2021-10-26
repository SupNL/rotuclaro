const { default: ConfirmDialog } = require('components/ConfirmDialog');
const { BarCodeScanner } = require('expo-barcode-scanner');
const { Linking } = require('react-native');

const handleCameraPermission = (res, permission, setPermission, onFail) => {
    if (!res.granted && !res.canAskAgain) {
        ConfirmDialog(
            'Erro de permissão',
            'A aplicação não tem permissão para usar a câmera. Atualize as permissões em configurações',
            () => {
                Linking.openSettings().then(
                    setTimeout(() => {
                        BarCodeScanner.getPermissionsAsync().then(
                            (permission) => {
                                if (permission.canAskAgain) {
                                    setPermission(
                                        permission.granted
                                    );
                                } else {
                                    onFail();
                                }
                            }
                        );
                    }, 1)
                );
            },
            onFail,
            'Ir para configurações',
            'Cancelar'
        );
    } else if (permission === null) {
        BarCodeScanner.requestPermissionsAsync().then((permission) => {
            setPermission(permission.granted);
        });
    } else if (permission === false) {
        ConfirmDialog(
            'Erro de permissão',
            'O leitor de barras precisa de permissão da câmera. Dê a permissão para conseguir realizar uma leitura.',
            () => {
                setPermission(null);
            },
            onFail,
            'Definir permissão',
            'Cancelar'
        );
    }
};

export default handleCameraPermission;