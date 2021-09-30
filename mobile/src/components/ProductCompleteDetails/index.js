import CustomText from 'components/CustomText';
import Header3 from 'components/Headers/Header3';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import COLORS from 'shared/COLORS';

const ProductCompleteDetails = ({ alert, product }) => {
    const renderType = (type) => {
        return type == 'calorias' ? 'Kcal' : 'g';
    };

    const renderAlergenicAlert = (alergenics) => {
        return alergenics.map((c, i) => {
            return (
                <View key={i} style={{ flexWrap: 'wrap' }}>
                    <Header3
                        style={{
                            ...styles.dangerAlergenicText,
                        }}
                    >
                        Contém {c.nome.toUpperCase()}
                    </Header3>
                </View>
            );
        });
    };

    const renderComponentsAlert = (components) => {
        return components.map((c, i) => {
            return (
                <View
                    key={i}
                    style={
                        c.nivel == 'alto'
                            ? styles.dangerFill
                            : c.nivel == 'médio'
                            ? styles.warningFill
                            : styles.successFill
                    }
                >
                    <View style={styles.componentWrapper}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Header3
                                style={{
                                    color:
                                        c.nivel == 'alto'
                                            ? COLORS.error
                                            : c.nivel == 'médio'
                                            ? COLORS.warning
                                            : COLORS.success,
                                }}
                            >
                                {c.tipo.charAt(0).toUpperCase() +
                                    c.tipo.slice(1) +
                                    ' '}
                            </Header3>
                            <Header3
                                style={{
                                    color:
                                        c.nivel == 'alto'
                                            ? COLORS.error
                                            : c.nivel == 'médio'
                                            ? COLORS.warning
                                            : COLORS.success,
                                }}
                            >
                                {c.total + ' ' + renderType(c.tipo)}
                            </Header3>
                        </View>
                    </View>
                    {c.nivel == 'alto' ? (
                        <CustomText>
                            Até {c.limiteAlto + ' ' + renderType(c.tipo)}
                        </CustomText>
                    ) : c.nivel == 'médio' ? (
                        <CustomText>
                            Entre {c.limiteMedio + ' ' + renderType(c.tipo)} -{' '}
                            {c.limiteAlto + ' ' + renderType(c.tipo)}
                        </CustomText>
                    ) : c.nivel == 'baixo' ? (
                        <CustomText>
                            Abaixo de {c.limiteMedio + ' ' + renderType(c.tipo)}
                        </CustomText>
                    ) : (
                        <CustomText>
                            Ignorado pelo perfil
                        </CustomText>
                    )}
                </View>
            );
        });
    };

    return (
        <View style={{ ...styles.wrapper }}>
            {alert.componentes && alert.items ? (
                <>
                    {alert.componentes.length > 0 && (
                        <View style={styles.dangerAlergenicWrapper}>
                            {renderAlergenicAlert(product.componentesAlergenicos)}
                        </View>
                    )}
                    {alert.items.length > 0 &&
                        renderComponentsAlert(alert.items)}
                    <View>
                        {alert.items.length == 0 &&
                            alert.componentes.length == 0 && (
                                <CustomText style={styles.safeProductText}>
                                    Produto em conformidade com seu perfil.
                                </CustomText>
                            )}
                    </View>
                </>
            ) : (
                <CustomText>Aguarde..</CustomText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'flex-start',
        padding: 0,
        marginBottom: 8,
    },
    componentWrapper: {
        marginVertical: 2,
        alignItems: 'flex-start',
    },

    headerTitle: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },

    dangerAlergenicText: {
        color: COLORS.white,
    },
    dangerAlergenicWrapper: {
        backgroundColor: COLORS.error,
        width: '100%',
        padding: 12,
        borderRadius: 8,
    },

    dangerFill: {
        borderBottomColor: COLORS.error,
        borderBottomWidth: 8,
        paddingBottom: 4,
        marginTop: 12,
        width: '100%',
    },
    warningFill: {
        borderBottomColor: COLORS.warning,
        borderBottomWidth: 8,
        paddingBottom: 4,
        marginTop: 12,
        width: '100%',
    },
    successFill: {
        borderBottomColor: COLORS.success,
        borderBottomWidth: 8,
        paddingBottom: 4,
        marginTop: 12,
        width: '100%',
    },

    safeProductText: {
        color: COLORS.success,
    },
});

export default ProductCompleteDetails;
