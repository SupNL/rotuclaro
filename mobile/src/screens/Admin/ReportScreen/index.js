import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import sharedStyles from 'shared/sharedStyles';
import ReportContent from 'components/ReportContent';
import Header3 from 'components/Headers/Header3';
import CustomText from 'components/CustomText';
import COLORS from 'shared/COLORS';
import BigErrorMessage from 'components/BigErrorMessage';
import { fetchSummary } from 'services/report/fetchReport';

const ReportScreen = () => {
    const [summaryData, setSummaryData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetchSummary()
            .then((data) => {
                setSummaryData(data);
                setIsLoading(false);
            })
            .catch((err) => setError(err));
    }, []);

    return (
        <View style={sharedStyles.horizontalAlignedScreen}>
            <ScrollView>
                {error ? (
                    <BigErrorMessage>
                        Ocorreu um erro na consulta
                    </BigErrorMessage>
                ) : isLoading ? (
                    <ActivityIndicator
                        style={{ marginVertical: 8 }}
                        color={COLORS.secondary}
                    />
                ) : (
                    summaryData && (
                        <>
                            <ReportContent title={'Consultas realizadas hoje'}>
                                <Header3>{summaryData.consultasHoje}</Header3>
                            </ReportContent>
                            <ReportContent
                                detailsNavigation={() => {}}
                                title={'Perfis cadastrados'}
                            >
                                <Header3>{summaryData.totalPerfil}</Header3>
                            </ReportContent>
                            <ReportContent
                                detailsNavigation={() => {}}
                                title={'Componente alergênico mais evitado'}
                            >
                                <Header3>
                                    {summaryData.componenteEvitado
                                        .nomeComponente
                                        ? `${summaryData.componenteEvitado.nomeComponente} (${summaryData.componenteEvitado.numPerfis})`
                                        : 'Nenhum'}
                                </Header3>
                            </ReportContent>
                            <ReportContent
                                detailsNavigation={() => {}}
                                title={
                                    'Produto mais consultado nos últimos três dias'
                                }
                            >
                                <CustomText style={{ fontWeight: 'bold' }}>
                                    {summaryData.componenteEvitado
                                        .nomeComponente
                                        ? summaryData.produtoMaisConsultado
                                              .nomeProduto
                                        : 'Nenhum'}
                                </CustomText>
                            </ReportContent>
                        </>
                    )
                )}
            </ScrollView>
        </View>
    );
};

export default ReportScreen;
