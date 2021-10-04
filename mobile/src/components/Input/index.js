import React, { useRef, useEffect, useCallback } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { useField } from '@unform/core';
import COLORS from 'shared/COLORS';
import { useState } from 'react';
import InputErrorText from 'components/InputErrorText';

function Input({
    name,
    label,
    onChangeText,
    type,
    style,
    prefix,
    suffix,
    ...rest
}) {
    const inputRef = useRef(null);
    const { fieldName, registerField, defaultValue, error } = useField(name);
    const [currentValue, setCurrentValue] = useState(defaultValue ? defaultValue : '');

    useEffect(() => {
        inputRef.current.value = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        if (inputRef.current) inputRef.current.value = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            getValue() {
                if (inputRef.current) return inputRef.current.value;

                return '';
            },
            setValue(ref, value) {
                if (inputRef.current) {
                    inputRef.current.value = value;
                    setCurrentValue(value);
                }
            },
            clearValue() {
                if (inputRef.current) {
                    inputRef.current.setNativeProps({ text: '' });
                    inputRef.current.value = '';
                }
            },
        });
    }, [fieldName, registerField]);

    const handleChangeText = useCallback(
        (text) => {
            if (type === 'number') {
                if (!text.match(/^(([0-9])*((\.|,)[0-9]{0,10})?)$/)) {
                    return;
                }
            }
            setCurrentValue(text);
            if (inputRef.current) inputRef.current.value = text;
            if (onChangeText) onChangeText(text);
        },
        [onChangeText]
    );

    return (
        <View style={{ ...style }}>
            {label && <Text>{label}</Text>}
            <View style={{ ...styles.textInputWrapper, ...style?.box }}>
                {prefix && (
                    <View style={styles.boxes}>
                        <Text style={styles.textBoxes}>{prefix}</Text>
                    </View>
                )}
                <TextInput
                    ref={inputRef}
                    value={currentValue}
                    onChangeText={handleChangeText}
                    defaultValue={defaultValue}
                    style={{ ...styles.input, ...style?.text }}
                    secureTextEntry={type === 'password' ? true : false}
                    keyboardType={type === 'number' ? 'decimal-pad' : 'default'}
                    {...rest}
                />
                {suffix && (
                    <View style={styles.boxes}>
                        <Text style={styles.textBoxes}>{suffix}</Text>
                    </View>
                )}
            </View>
            {error && <InputErrorText>{error}</InputErrorText>}
        </View>
    );
}

const styles = StyleSheet.create({
    textInputWrapper: {
        flexDirection: 'row',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderColor: COLORS.black,
    },
    boxes: {
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: COLORS.black,
        paddingHorizontal: 4,
    },
    textBoxes: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Input;
