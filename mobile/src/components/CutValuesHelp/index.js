import React from 'react';
import CustomModal from 'components/CustomModal';
import CustomText from 'components/CustomText';
import { Image } from 'react-native';
import CustomButton from 'components/CustomButton';

const CutValuesHelp = ({ modalVisible, setModalVisible }) => (
    <CustomModal
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible((old) => !old);
        }}
    >
        <CustomText>
            Estes cortes, como mostra a figura abaixo, vão poder te alertar
            quando o componente do alimento estiver em quantidade média
            (indicado por amarelo), e em quantidade alta (indicado em
            vermelho).
        </CustomText>
        <Image
            style={{
                width: '100%',
                resizeMode: 'contain',
            }}
            source={require('./images/cutsHelp.png')}
        />
        <CustomButton
            title='Entendi!'
            onPress={() => setModalVisible((old) => !old)}
            style={{ marginTop: 'auto' }}
        />
    </CustomModal>
);

export default CutValuesHelp;