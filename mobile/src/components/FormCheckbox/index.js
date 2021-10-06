import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useField } from '@unform/core';
import { useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import CustomText from 'components/CustomText';

function FormCheckbox({ name, label, setExternalTracker }) {
    const checkboxRef = useRef(null);
    const { fieldName, registerField, defaultValue } = useField(name);
    const [currentValue, setCurrentValue] = useState(
        defaultValue ? defaultValue : false
    );

    useEffect(() => {
        setExternalTracker(currentValue);
    }, [currentValue]);

    useEffect(() => {
        checkboxRef.current = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        if (checkboxRef.current) checkboxRef.current = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue() {
                if (checkboxRef.current) return checkboxRef.current;
                return false;
            },
            setValue(ref, value) {
                if (checkboxRef.current) {
                    checkboxRef.current = value;
                    setCurrentValue(value);
                }
            },
            clearValue() {
                if (checkboxRef.current) {
                    checkboxRef.current = '';
                }
            },
        });
    }, [fieldName, registerField]);

    return (
        <View style={styles.checkboxContainer}>
            <CheckBox
                style={{
                    marginLeft: 0
                }}
                value={currentValue}
                ref={checkboxRef}
                onChange={() => {
                    setCurrentValue((old) => {
                        checkboxRef.current = !old;
                        return !old;
                    });
                }}
            />
            <CustomText>{label}</CustomText>
        </View>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default FormCheckbox;
