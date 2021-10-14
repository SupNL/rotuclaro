import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import api from 'services/api';
import ListItem from 'components/ListItem';
import CustomButton from 'components/CustomButton';
import axios from 'axios';
import ShowToast from 'utils/ShowToast';
import COLORS from 'shared/COLORS';
import ConfirmDialog from 'components/ConfirmDialog';
import CustomModal from 'components/CustomModal';
import CustomText from 'components/CustomText';
import Input from 'components/Input';
import { Form } from '@unform/mobile';
import { fetchAlergenicComponents } from 'services/alergenicComponents/fetchAlergenicComponent';
import LoadingCircle from 'components/LoadingCircle';
import BigErrorMessage from 'components/BigErrorMessage';

const ListAlergenicComponent = ({ navigation }) => {
    const formRef = useRef(null);
    const [components, setComponents] = useState([]);
    const [targetComponent, setTargetComponent] = useState({
        id: -1,
        name: '',
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const [editModalActive, setEditModalActive] = useState(false);
    const [createModalActive, setCreateModalActive] = useState(false);

    const source = axios.CancelToken.source();

    const loadComponents = () => {
        let lastName;
        if (components.length > 0)
            lastName = components[components.length - 1].nome;
        fetchAlergenicComponents(source.token, lastName)
            .then(([fetchedComponents, count]) => {
                if (components.length + fetchedComponents.length >= count)
                    setIsLoading(false);
                setComponents((old) => [...old, ...fetchedComponents]);
            })
            .catch((err) => {
                setError(err);
            });
    };

    const handleDelete = (componentId, componentName) => {
        ConfirmDialog(
            `Deseja realmente excluir "${componentName}"?`,
            'Essa operação é irreversível',
            () =>
                api.delete(`/componente_alergenico/${componentId}`).then(() => {
                    setComponents((old) =>
                        old.filter((c) => c.id !== componentId)
                    );
                    ShowToast('Componente excluído');
                }),
            () => {}
        );
    };

    const handleEdit = (componentId, componentName) => {
        setTargetComponent({ id: componentId, name: componentName });
        setEditModalActive(true);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadComponents();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setComponents([]);
            setIsLoading(true);
            setError(null);
        });
        return unsubscribe;
    }, [navigation]);

    const EditModalScreen = (
        <CustomModal
            visible={editModalActive}
            onRequestClose={() => {
                setEditModalActive((old) => !old);
            }}
        >
            <CustomText>Alterar {targetComponent.name}</CustomText>
            <Form
                initialData={{
                    name: targetComponent.name,
                }}
                ref={formRef}
                onSubmit={(data) => {
                    formRef.current.setErrors({});
                    if (data.name == null || data.name == '') {
                        formRef.current.setErrors({
                            name: 'Nome do componente obrigatório',
                        });
                    } else {
                        setSubmitIsLoading(true);
                        api.put(
                            `/componente_alergenico/${targetComponent.id}`,
                            {
                                nome: data.name,
                            }
                        )
                            .then(() => {
                                setComponents((old) =>
                                    old.map((c) => {
                                        c.nome =
                                            c.id === targetComponent.id
                                                ? data.name
                                                : c.nome;
                                        return c;
                                    })
                                );
                                ShowToast('Componente alterado');
                                setEditModalActive(false);
                            })
                            .catch(() => {})
                            .finally(() => setSubmitIsLoading(false));
                    }
                }}
            >
                <Input
                    name='name'
                    label='Nome do componente'
                    placeholder='Nome do componente'
                    style={{ marginBottom: 8 }}
                    editable={!submitIsLoading}
                />
                {submitIsLoading ? (
                    <LoadingCircle />
                ) : (
                    <CustomButton
                        title='Atualizar'
                        style={{ marginBottom: 8 }}
                        onPress={() => formRef.current.submitForm()}
                    />
                )}
                <CustomButton
                    title='Cancelar'
                    onPress={() => setEditModalActive(false)}
                />
            </Form>
        </CustomModal>
    );

    const CreateModalScreen = (
        <CustomModal
            visible={createModalActive}
            onRequestClose={() => {
                setCreateModalActive((old) => !old);
            }}
        >
            <CustomText>Cadastrar novo componente alergênico</CustomText>
            <Form
                ref={formRef}
                onSubmit={(data) => {
                    formRef.current.setErrors({});
                    if (data.name == null || data.name == '') {
                        formRef.current.setErrors({
                            name: 'Nome do componente obrigatório',
                        });
                    } else {
                        setSubmitIsLoading(true);
                        api.post('/componente_alergenico', {
                            nome: data.name,
                        })
                            .then((res) => {
                                setComponents((old) => [res.data, ...old]);
                                ShowToast('Componente criado');
                                setCreateModalActive(false);
                            })
                            .catch(() => {})
                            .finally(() => setSubmitIsLoading(false));
                    }
                }}
            >
                <Input
                    name='name'
                    label='Nome do componente'
                    placeholder='Nome do componente'
                    style={{ marginBottom: 8 }}
                    editable={!submitIsLoading}
                />
                {submitIsLoading ? (
                    <LoadingCircle />
                ) : (
                    <CustomButton
                        title='Cadastrar'
                        style={{ marginBottom: 8 }}
                        onPress={() => formRef.current.submitForm()}
                    />
                )}
                <CustomButton
                    title='Cancelar'
                    onPress={() => setCreateModalActive(false)}
                />
            </Form>
        </CustomModal>
    );

    const renderItem = ({ item }) => {
        return (
            <ListItem
                id={item.id}
                label={item.nome}
                canDelete={item.permiteExclusao}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
            />
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {CreateModalScreen}
            {EditModalScreen}
            <CustomButton
                title='Adicionar novo Componente Alergênico'
                onPress={() => setCreateModalActive(true)}
            />
            {error ? (
                <BigErrorMessage>Ocorreu um erro na consulta</BigErrorMessage>
            ) : (
                <FlatList
                    data={components}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={
                        isLoading && (
                            <ActivityIndicator
                                style={{ marginVertical: 8 }}
                                color={COLORS.secondary}
                            />
                        )
                    }
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        if (isLoading) loadComponents(source.token);
                    }}
                />
            )}
        </View>
    );
};

export default ListAlergenicComponent;
