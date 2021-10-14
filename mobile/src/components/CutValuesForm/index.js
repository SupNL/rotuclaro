import React, { useRef, useState } from 'react';
import { Form } from '@unform/mobile';
import CustomSlider from 'components/CustomSlider';
import CustomButton from 'components/CustomButton';
import { StyleSheet, View } from 'react-native';
import COLORS from 'shared/COLORS';
import CustomModal from 'components/CustomModal';
import CustomText from 'components/CustomText';
import Input from 'components/Input';
import CheckBox from '@react-native-community/checkbox';
import LoadingCircle from 'components/LoadingCircle';

const mapComponent = (name) => {
    switch (name) {
        case 'kcal-slider':
            return 'calorias';
        case 'carbo-slider':
            return 'carboidratos';
        case 'sugar-slider':
            return 'açúcares';
        case 'fat-slider':
            return 'gorduras totais';
        case 'fat-trans-slider':
            return 'gorduras trans';
        case 'fat-saturated-slider':
            return 'gorduras saturadas';
        case 'sodium-slider':
            return 'sódio';
    }
};

const CutValuesForm = ({
    formRef,
    handleSubmit,
    initialData,
    gramValue,
    mlValue,
    submitLabel,
    submitIsLoading,
    ignoreExtra,
}) => {
    const minValue = 0;

    const [check, setCheck] = useState(
        ignoreExtra == null ? false : !ignoreExtra
    );
    const [changingSlider, setChangingSlider] = useState(['', 0, 0]);
    const [changeValueModalVisible, setChangeValueModalVisible] =
        useState(false);

    const handleLabelPress = (name, leftValue, rightValue) => {
        setChangingSlider([name, leftValue, rightValue]);
        setChangeValueModalVisible(true);
    };

    const ChangeValueModalScreen = () => {
        const changeFormRef = useRef(null);

        const handleSubmit = (data) => {
            if (parseFloat(data.med) >= parseFloat(data.high)) {
                changeFormRef.current.setErrors({
                    med: 'O valor médio deve ser menor que o alto',
                });
            } else {
                formRef.current.setFieldValue(changingSlider[0], [
                    parseFloat(data.med) * 100,
                    parseFloat(data.high) * 100,
                ]);
                setChangeValueModalVisible(false);
            }
        };

        return (
            <CustomModal
                visible={changeValueModalVisible}
                onRequestClose={() => {
                    setChangeValueModalVisible(false);
                }}
            >
                <CustomText>
                    Alterando {mapComponent(changingSlider[0])}
                </CustomText>
                <Form
                    onSubmit={handleSubmit}
                    ref={changeFormRef}
                    initialData={{
                        med: (
                            Math.round(
                                (changingSlider[1] / 100 + Number.EPSILON) * 100
                            ) / 100
                        ).toString(),
                        high: (
                            Math.round(
                                (changingSlider[2] / 100 + Number.EPSILON) * 100
                            ) / 100
                        ).toString(),
                    }}
                >
                    <Input
                        name='med'
                        label='Médio'
                        placeholder='Corte médio'
                        type='number'
                        suffix={
                            mapComponent(changingSlider[0]) !== 'calorias'
                                ? 'g'
                                : 'kcal'
                        }
                        style={{
                            text: {
                                textAlign: 'right',
                            },
                            padding: 8,
                            backgroundColor: COLORS.warningLight,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                    />
                    <Input
                        name='high'
                        label='Alto'
                        placeholder='Corte alto'
                        type='number'
                        suffix={
                            mapComponent(changingSlider[0]) !== 'calorias'
                                ? 'g'
                                : 'kcal'
                        }
                        style={{
                            marginBottom: 8,
                            text: {
                                textAlign: 'right',
                            },
                            padding: 8,
                            backgroundColor: COLORS.errorLight,
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                        }}
                    />
                </Form>
                <View style={{ flexDirection: 'row' }}>
                    <CustomButton
                        title='Alterar'
                        onPress={() => changeFormRef.current.submitForm()}
                        style={{ flex: 1, marginRight: 4 }}
                    />
                    <CustomButton
                        title='Cancelar'
                        onPress={() => setChangeValueModalVisible(false)}
                        style={{ flex: 1 }}
                    />
                </View>
            </CustomModal>
        );
    };

    return (
        <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={initialData}
            style={{
                alignItems: 'center',
            }}
        >
            <ChangeValueModalScreen />
            <CustomSlider
                name='kcal-slider'
                handleLabelPress={handleLabelPress}
                minValue={minValue}
                maxValue={gramValue * 100 * 8}
                label={`Valor energético (Kcal) em ${gramValue} g / ${mlValue} ml`}
                step={gramValue * 5}
                suffix=' Kcal'
                labelLeft='MÉDIO: '
                labelRight='ALTO: '
                disabled={submitIsLoading}
            />
            <CustomSlider
                name='carbo-slider'
                handleLabelPress={handleLabelPress}
                minValue={minValue}
                maxValue={gramValue * 100}
                label={`Carboidratos em ${gramValue} g / ${mlValue} ml`}
                step={gramValue}
                suffix=' g de carboidratos'
                labelLeft='MÉDIO: '
                labelRight='ALTO: '
                disabled={submitIsLoading}
            />
            <CustomSlider
                name='sugar-slider'
                handleLabelPress={handleLabelPress}
                minValue={minValue}
                maxValue={gramValue * 100}
                label={`Açúcares em ${gramValue} g / ${mlValue} ml`}
                step={gramValue}
                suffix=' g de açúcares'
                labelLeft='MÉDIO: '
                labelRight='ALTO: '
                disabled={submitIsLoading}
            />
            <CustomSlider
                name='fat-slider'
                handleLabelPress={handleLabelPress}
                minValue={minValue}
                maxValue={gramValue * 100}
                label={`Gorduras totais em ${gramValue} g / ${mlValue} ml`}
                step={gramValue}
                suffix=' g de gorduras totais'
                labelLeft='MÉDIO: '
                labelRight='ALTO: '
                disabled={submitIsLoading}
            />
            <CustomSlider
                name='sodium-slider'
                handleLabelPress={handleLabelPress}
                minValue={minValue}
                maxValue={(gramValue * 100) / 20}
                label={`Sal (sódio) em ${gramValue} g / ${mlValue} ml`}
                step={gramValue / 10}
                suffix=' g de sal'
                labelLeft='MÉDIO: '
                labelRight='ALTO: '
                disabled={submitIsLoading}
            />
            <View style={styles.checkboxContainer}>
                <CheckBox
                    disabled={submitIsLoading}
                    value={check}
                    onChange={() => {
                        setCheck((old) => !old);
                    }}
                />
                <CustomText>Apresentar gorduras saturadas e trans</CustomText>
            </View>

            {check && (
                <>
                    <CustomSlider
                        name='fat-trans-slider'
                        handleLabelPress={handleLabelPress}
                        minValue={minValue}
                        maxValue={(gramValue * 100) / 2}
                        label={`Gorduras trans em ${gramValue} g / ${mlValue} ml`}
                        step={gramValue}
                        suffix=' g de gorduras trans'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                        disabled={submitIsLoading}
                    />
                    <CustomSlider
                        name='fat-saturated-slider'
                        handleLabelPress={handleLabelPress}
                        minValue={minValue}
                        maxValue={(gramValue * 100) / 2}
                        label={`Gorduras saturadas em ${gramValue} g / ${mlValue} ml`}
                        step={gramValue}
                        suffix=' g de gorduras saturadas'
                        labelLeft='MÉDIO: '
                        labelRight='ALTO: '
                        disabled={submitIsLoading}
                    />
                </>
            )}
            {submitIsLoading ? (
                <LoadingCircle />
            ) : (
                <CustomButton
                    title={submitLabel}
                    onPress={() => formRef.current.submitForm()}
                    style={{ width: '100%' }}
                />
            )}
        </Form>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
});

export default CutValuesForm;
