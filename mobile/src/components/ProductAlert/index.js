import CustomText from 'components/CustomText';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import COLORS from 'shared/COLORS';

const ProductAlert = ({ profile, alert, product }) => {
    const renderAlergenicAlert = (alergenics) => {
        return alergenics.map((c, i) => {
            return (
                <View key={i}>
                    <CustomText style={styles.dangerAlergenicText}>
                        CONTÉM {c.toUpperCase()}
                    </CustomText>
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
                            : styles.warningFill
                    }
                >
                    <View style={styles.componentWrapper}>
                        <CustomText
                            style={
                                c.nivel == 'alto'
                                    ? styles.dangerText
                                    : styles.warningText
                            }
                        >
                            {c.nivel.toUpperCase()}: {c.total}{' '}
                            {c.tipo == 'calorias' ? 'Kcal' : 'g'}
                        </CustomText>
                        <CustomText
                            style={
                                c.nivel == 'alto'
                                    ? styles.dangerText
                                    : styles.warningText
                            }
                        >
                            {c.tipo.toUpperCase()}
                        </CustomText>
                    </View>
                    <CustomText>
                        Limite: {c.limite} {c.tipo == 'calorias' ? 'kcal' : 'g'}
                    </CustomText>
                </View>
            );
        });
    };

    console.log(alert.componentes);

    return (
        <View style={{ ...styles.wrapper }}>
            <CustomText
                style={styles.headerTitle}
            >
                {product.nome}
            </CustomText>
            <CustomText style={{ ...styles.headerTitle, marginBottom: 12 }}>
                PORÇÃO DE {profile.gramas} g
            </CustomText>
            {alert.componentes && alert.componentes.length > 0 && (
                <View style={styles.dangerAlergenicWrapper}>
                    <CustomText style={styles.dangerAlergenicText}>
                        ALERTA!
                    </CustomText>
                    {renderAlergenicAlert(alert.componentes)}
                </View>
            )}
            {alert.items && alert.items.length > 0 && (
                renderComponentsAlert(alert.items)
            )}
            {alert.items && alert.items.length == 0 && alert.componentes && alert.componentes.length == 0 && (
                <View>
                    <CustomText style={styles.safeProductText}>Produto em conformidade com seu perfil.</CustomText>
                </View>
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
        fontSize: 20,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },

    dangerAlergenicText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 20,
    },
    dangerAlergenicWrapper: {
        backgroundColor: COLORS.error,
        width: '100%',
        padding: 16,
        borderRadius: 8,
    },

    dangerText: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: 24,
        flexWrap: 'wrap',
    },
    warningText: {
        color: COLORS.warning,
        fontWeight: 'bold',
        fontSize: 24,
        flexWrap: 'wrap',
    },

    dangerFill: {
        borderLeftColor: COLORS.error,
        borderLeftWidth: 32,
        paddingLeft: 8,
        marginTop: 10,
        width: '100%',
    },
    warningFill: {
        borderLeftColor: COLORS.warning,
        borderLeftWidth: 32,
        paddingLeft: 8,
        marginTop: 10,
        width: '100%',
    },

    safeProductText : {
        color : COLORS.success,
        fontWeight : 'bold',
        fontSize: 20,
    }
});

export default ProductAlert;
