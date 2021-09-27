import CustomText from 'components/CustomText';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'react-native-feather';
import COLORS from 'shared/COLORS';

const ReportContent = ({ title, children, wrapperStyle, detailsNavigation }) => {
    return (
        <View style={{ ...styles.wrapper, ...wrapperStyle }}>
            <CustomText>{title}</CustomText>
            {children}
            {detailsNavigation && (
                <TouchableOpacity style={styles.detailsReport}>
                    <CustomText style={{ fontWeight: 'bold' }}>Detalhes</CustomText>
                    <ChevronRight stroke={COLORS.black} width={16} height={16} strokeWidth={3} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        padding: 16,
        marginBottom: 8,
    },
    detailsReport: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
});

export default ReportContent;
