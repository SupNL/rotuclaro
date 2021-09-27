import React from 'react';
import { ScrollView } from 'react-native';

import sharedStyles from 'shared/sharedStyles';
import ReportContent from 'components/ReportContent';
import { HeaderTitle } from '@react-navigation/stack';

const ReportScreen = () => {
    return (
        <ScrollView contentContainerStyle={sharedStyles.horizontalAlignedScreen}>
            <ReportContent detailsNavigation={() => {}} title={'Perfis cadastrados'}>
                <HeaderTitle>114</HeaderTitle>
            </ReportContent>
            <ReportContent detailsNavigation={() => {}} title={'Componente alergênico mais evitado'}>
                <HeaderTitle>Glúten (80 perfis)</HeaderTitle>
            </ReportContent>
        </ScrollView>
    );
};

export default ReportScreen;
