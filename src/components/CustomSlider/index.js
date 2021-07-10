import React, { useRef, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { useField } from '@unform/core';
import { useState } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

function CustomSlider({
    name,
    onChangeText,
    maxValue,
    label,
    suffix,
    labelLeft,
    labelRight,
    ...rest
}) {
    const sliderRef = useRef(null);
    const deviceWidth = Dimensions.get('screen').width;
    const { fieldName, registerField, defaultValue } = useField(name);

    const [leftValue, setLeftValue] = useState(defaultValue ? defaultValue[0] : 0);
    const [rightValue, setRightValue] = useState(defaultValue ? defaultValue[1] : maxValue ? maxValue : 1000);

    useEffect(() => {
        sliderRef.current.value = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        if (sliderRef.current) sliderRef.current.value = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: sliderRef.current,
            getValue() {
                if (sliderRef.current) return sliderRef.current.value;

                return '';
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

    return (
        <View>
            {label && <Text style={{ fontWeight: 'bold' }}>{label}</Text>}
            {labelLeft && <Text>{labelLeft + leftValue / 100}{suffix}</Text>}
            {labelRight && <Text>{labelRight + rightValue / 100}{suffix}</Text>}
            <MultiSlider
                sliderLength={deviceWidth * 0.8}
                values={[leftValue , rightValue]}
                min={0}
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

const styles = StyleSheet.create({});

export default CustomSlider;
