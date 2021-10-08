import React, { useRef, useState } from 'react';
import Header from 'components/Header';
import { StyleSheet, ScrollView, View } from 'react-native';

import CustomText from 'components/CustomText';
import sharedStyles from 'shared/sharedStyles';
import CustomButton from 'components/CustomButton';
import { useAuth } from 'hooks/useAuth';
import { Perfil } from 'model/Perfil';
import api from 'services/api';
import ShowToast from 'utils/ShowToast';
import CutValuesForm from 'components/CutValuesForm';
import CutValuesHelp from 'components/CutValuesHelp';

const ChangeCutValues = ({ navigation }) => {
    const formRef = useRef(null);

    const [modalVisible, setModalVisible] = useState(false);

    const { perfil, updateProfile } = useAuth();

    const handleSubmit = (data) => {
        const submitData = {
            limiteMedioKcal: data['kcal-slider'][0] / 100,
            limiteAltoKcal: data['kcal-slider'][1] / 100,
            limiteMedioCarboidratos: data['carbo-slider'][0] / 100,
            limiteAltoCarboidratos: data['carbo-slider'][1] / 100,
            limiteMedioAcucares: data['sugar-slider'][0] / 100,
            limiteAltoAcucares: data['sugar-slider'][1] / 100,
            limiteMedioGordurasTotais: data['fat-slider'][0] / 100,
            limiteAltoGordurasTotais: data['fat-slider'][1] / 100,
            limiteMedioGordurasTrans: data['fat-trans-slider']
                ? data['fat-trans-slider'][0] / 100
                : 0,
            limiteAltoGordurasTrans: data['fat-trans-slider']
                ? data['fat-trans-slider'][1] / 100
                : 0,
            limiteMedioGordurasSaturadas: data['fat-saturated-slider']
                ? data['fat-saturated-slider'][0] / 100
                : 0,
            limiteAltoGordurasSaturadas: data['fat-saturated-slider']
                ? data['fat-saturated-slider'][1] / 100
                : 0,
            limiteMedioSodio: data['sodium-slider'][0] / 100,
            limiteAltoSodio: data['sodium-slider'][1] / 100,
        };
        api.put('/perfil', submitData)
            .then((res) => {
                const newProfile = res.data;
                const dummyProfile = new Perfil(newProfile);
                updateProfile(dummyProfile).then(() => {
                    ShowToast('Perfil atualizado');
                    navigation.goBack();
                });
            })
            .catch((err) => {
                console.log({ err });
            });
    };

    return (
        <ScrollView>
            <View style={sharedStyles.defaultScreen}>
                <CutValuesHelp
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                />
                <Header>Alterar valores de corte</Header>
                <CustomText style={styles.text}>
                    Para cada componente, informe um valor de corte desejado. As
                    gorduras saturadas e trans são opcionais.
                </CustomText>
                <CustomText style={styles.text}>
                    1. O primeiro corte te dará um alerta amarelo (médio),
                    mostrando que necessita de sua atenção.
                </CustomText>
                <CustomText style={styles.text}>
                    2. O segundo corte te dará um alerta vermelho (ALTO), na
                    qual o componente será considerado em excesso no produto.
                </CustomText>
                <CustomButton
                    title='Ajuda'
                    onPress={() => setModalVisible((old) => !old)}
                    style={{ marginBottom: 8 }}
                />
                <CutValuesForm
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                    submitLabel={'Salvar'}
                    ignoreExtra={perfil.ignoraExtra()}
                    gramValue={perfil.gramas}
                    mlValue={perfil.ml}
                    initialData={{
                        'kcal-slider': [
                            perfil.limiteMedioKcal * 100,
                            perfil.limiteAltoKcal * 100,
                        ],
                        'carbo-slider': [
                            perfil.limiteMedioCarboidratos * 100,
                            perfil.limiteAltoCarboidratos * 100,
                        ],
                        'sugar-slider': [
                            perfil.limiteMedioAcucares * 100,
                            perfil.limiteAltoAcucares * 100,
                        ],
                        'fat-slider': [
                            perfil.limiteMedioGordurasTotais * 100,
                            perfil.limiteAltoGordurasTotais * 100,
                        ],

                        'fat-trans-slider': perfil.ignoraExtra()
                            ? [
                                  0.02 * (perfil.gramas * 100),
                                  0.05 * (perfil.gramas * 100),
                              ]
                            : [
                                  perfil.limiteMedioGordurasTrans * 100,
                                  perfil.limiteAltoGordurasTrans * 100,
                              ],
                        'fat-saturated-slider': perfil.ignoraExtra()
                            ? [
                                  0.04 * (perfil.gramas * 100),
                                  0.1 * (perfil.gramas * 100),
                              ]
                            : [
                                  perfil.limiteMedioGordurasSaturadas * 100,
                                  perfil.limiteAltoGordurasSaturadas * 100,
                              ],
                        'sodium-slider': [
                            perfil.limiteMedioSodio * 100,
                            perfil.limiteAltoSodio * 100,
                        ],
                    }}
                />
                <CustomButton
                    title='Cancelar'
                    style={{ marginTop: 8 }}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    text: {
        marginBottom: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
});

export default ChangeCutValues;
