import CustomText from 'components/CustomText';
import Header2 from 'components/Headers/Header2';
import Header3 from 'components/Headers/Header3';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import COLORS from 'shared/COLORS';

const ProductAlert = ({ profile, alert, product }) => {
    const renderType = (type) => {
        return type == 'calorias' ? 'Kcal' : 'g';
    };

    const renderAlergenicAlert = (alergenics) => {
        return alergenics.map((c, i) => {
            return (
                <View key={i} style={{ flexWrap: 'wrap' }}>
                    <Header2
                        style={{
                            ...styles.dangerAlergenicText,
                            fontWeight: 'bold',
                        }}
                    >
                        {c.toUpperCase()}
                    </Header2>
                </View>
            );
        });
    };

    const renderComponentsAlert = (components) => {
        const noLowComponents = components.filter((c) => c.nivel !== 'baixo' && c.nivel !== 'ignorar');
        return noLowComponents.map((c, i) => {
            return (
                <View
                    key={i}
                    style={
                        c.nivel == 'alto'
                            ? styles.dangerFill
                            : styles.warningFill
                    }
                >
                    <View style={styles.componentWrapper}>
                        <View>
                            <Header2
                                style={{
                                    color:
                                        c.nivel == 'alto'
                                            ? COLORS.error
                                            : COLORS.warning,
                                    fontWeight: 'bold',
                                }}
                            >
                                {c.nivel.toUpperCase()}
                            </Header2>
                        </View>
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
                                            : COLORS.warning,
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
                                            : COLORS.warning,
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
                    ) : (
                        <CustomText>
                            Entre {c.limiteMedio + ' ' + renderType(c.tipo)} - {c.limiteAlto + ' ' + renderType(c.tipo)}
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
                    <CustomText style={styles.headerTitle}>
                        {product.nome}
                    </CustomText>
                    <CustomText
                        style={{ ...styles.headerTitle, marginBottom: 12 }}
                    >
                        PORÇÃO DE {product.liquido ? profile.ml + ' ml' : profile.gramas + ' g'}
                    </CustomText>
                    {alert.componentes.length > 0 && (
                        <View style={styles.dangerAlergenicWrapper}>
                            <Header3 style={styles.dangerAlergenicText}>
                                Contém
                            </Header3>
                            {renderAlergenicAlert(alert.componentes)}
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
        width: '100%',
        alignItems: 'center',
        padding: 16,
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
        borderLeftColor: COLORS.error,
        borderLeftWidth: 24,
        paddingLeft: 8,
        marginTop: 10,
        width: '100%',
    },
    warningFill: {
        borderLeftColor: COLORS.warning,
        borderLeftWidth: 24,
        paddingLeft: 8,
        marginTop: 10,
        width: '100%',
    },

    safeProductText: {
        color: COLORS.success,
    },
});

export default ProductAlert;
