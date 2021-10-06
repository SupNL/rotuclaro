import React, { useRef, useEffect, useCallback } from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { useField } from '@unform/core';
import { useState } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import COLORS from 'shared/COLORS';
import { TouchableOpacity } from 'react-native-gesture-handler';

function CustomSlider({
    name,
    onChangeText,
    minValue,
    maxValue,
    label,
    suffix,
    labelLeft,
    labelRight,
    handleLabelPress,
    ...rest
}) {
    const sliderRef = useRef(null);
    const deviceWidth = Dimensions.get('screen').width;
    const { fieldName, registerField, defaultValue } = useField(name);

    const [leftValue, setLeftValue] = useState(
        defaultValue ? defaultValue[0] : 0
    );
    const [rightValue, setRightValue] = useState(
        defaultValue ? defaultValue[1] : maxValue ? maxValue : 1000
    );

    useEffect(() => {
        if (sliderRef.current) sliderRef.current.value = defaultValue;
    }, []);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: sliderRef.current,
            getValue() {
                if (sliderRef.current) return sliderRef.current.value;

                return '';
            },
            setValue(ref, value) {
                if (sliderRef.current) sliderRef.current.value = value;
                setLeftValue(value[0]);
                setRightValue(value[1]);
            },
            clearValue() {
                if (sliderRef.current) {
                    sliderRef.current.setNativeProps({ text: '' });
                    sliderRef.current.value = '';
                }
            },
        });
    }, [fieldName, registerField]);

    const handleValueChange = useCallback(
        (values) => {
            if (sliderRef.current) {
                sliderRef.current.value = values;
                setLeftValue(values[0]);
                setRightValue(values[1]);
            }
        },
        [onChangeText]
    );

    const CustomMarker = ({ color }) => {
        return (
            <View style={{ ...styles.marker, backgroundColor: color }}></View>
        );
    };

    return (
        <View>
            {label && <Text style={{ fontWeight: 'bold' }}>{label}</Text>}
            <TouchableOpacity activeOpacity={0.8} onPress={() => handleLabelPress(name, leftValue, rightValue)}>
                {labelLeft && (
                    <Text style={styles.warningText}>
                        {labelLeft + leftValue / 100}
                        {suffix}
                    </Text>
                )}
                {labelRight && (
                    <Text style={styles.dangerText}>
                        {labelRight + rightValue / 100}
                        {suffix}
                    </Text>
                )}
            </TouchableOpacity>
            <MultiSlider
                isMarkersSeparated={true}
                selectedStyle={{
                    backgroundColor: COLORS.black,
                }}
                unselectedStyle={{
                    backgroundColor: COLORS.grey,
                }}
                customMarkerLeft={(e) => {
                    return (
                        <CustomMarker
                            currentValue={e.currentValue}
                            color={COLORS.warning}
                        />
                    );
                }}
                customMarkerRight={(e) => {
                    return (
                        <CustomMarker
                            currentValue={e.currentValue}
                            color={COLORS.error}
                        />
                    );
                }}
                step={10}
                snapped={true}
                sliderLength={deviceWidth * 0.8}
                values={[leftValue, rightValue]}
                min={minValue ? minValue : 0}
                max={maxValue ? maxValue : 1000}
                name={fieldName}
                ref={sliderRef}
                onValuesChange={handleValueChange}
                // onValuesChangeStart={this.disableScroll}
                // onValuesChangeFinish={this.enableScroll}
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    marker: {
        borderRadius: 100,
        width: 18,
        height: 18,
    },

    warningText: {
        backgroundColor: COLORS.warningLight,
        fontWeight: 'bold',
        padding: 4,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    dangerText: {
        backgroundColor: COLORS.errorLight,
        fontWeight: 'bold',
        padding: 4,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
});

export default CustomSlider;
