import React from 'react';
import { ScrollView, View } from 'react-native';

import sharedStyles from 'shared/sharedStyles';
import ReportContent from 'components/ReportContent';
import Header3 from 'components/Headers/Header3';
import CustomText from 'components/CustomText';

const ReportScreen = () => {
    return (
        <View style={sharedStyles.horizontalAlignedScreen}>
            <ScrollView>
                <ReportContent
                    detailsNavigation={() => {}}
                    title={'Perfis cadastrados'}
                >
                    <Header3>114</Header3>
                </ReportContent>
                <ReportContent
                    detailsNavigation={() => {}}
                    title={'Componente alergênico mais evitado'}
                >
                    <Header3>Glúten (80 perfis)</Header3>
                </ReportContent>
                <ReportContent
                    detailsNavigation={() => {}}
                    title={'Consultas realizadas hoje'}
                >
                    <Header3>382</Header3>
                </ReportContent>
                <ReportContent
                    detailsNavigation={() => {}}
                    title={'Produto mais consultado nos últimos três dias'}
                >
                    <CustomText style={{ fontWeight: 'bold' }}>
                        SALGADINHO ELMA CHIPS CHEETOS ONDA REQUEIJAO 37GR
                    </CustomText>
                </ReportContent>
            </ScrollView>
        </View>
    );
};

export default ReportScreen;
