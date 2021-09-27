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

const ListAlergenicComponent = () => {
    const formRef = useRef(null);
    const [components, setComponents] = useState([]);
    const [targetComponent, setTargetComponent] = useState({
        id: -1,
        name: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    const [editModalActive, setEditModalActive] = useState(false);
    const [createModalActive, setCreateModalActive] = useState(false);

    const source = axios.CancelToken.source();
    const totalCount = useRef(-1);
    const page = useRef(1);

    const fetchComponents = (tokenSource) => {
        let url = '/componente_alergenico';
        if (components.length > 0) {
            const length = components.length;
            const lastName = components[length - 1].nome;
            url += `?last_name=${lastName}`;
        }
        api.get(url, {
            cancelToken: tokenSource,
        })
            .then((response) => {
                const data = response.data;
                totalCount.current = response.headers['x-total-count'];

                setComponents((old) => {
                    const newArray = [...old, ...data];
                    if (newArray.length == totalCount.current)
                        setIsLoading(false);
                    return newArray;
                });
                page.current += 1;
            })
            .catch((err) => {
                console.log({ err });
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
        fetchComponents(source.token, page);

        return () => {
            try {
                source.cancel();
            } catch (err) {
                if (axios.isCancel(err)) console.err(err);
            }
        };
    }, []);

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
                        api.put(
                            `/componente_alergenico/${targetComponent.id}`,
                            {
                                nome: data.name,
                            }
                        ).then(() => {
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
                        });
                    }
                }}
            >
                <Input
                    name='name'
                    label='Nome do componente'
                    placeholder='Nome do componente'
                    style={{ marginBottom: 8 }}
                />
                <CustomButton
                    title='Atualizar'
                    style={{ marginBottom: 8 }}
                    onPress={() => formRef.current.submitForm()}
                />
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
                        api.post(
                            '/componente_alergenico',
                            {
                                nome: data.name,
                            }
                        ).then((res) => {
                            setComponents((old) =>
                                [
                                    res.data,
                                    ...old
                                ]
                            );
                            ShowToast('Componente criado');
                            setCreateModalActive(false);
                        });
                    }
                }}
            >
                <Input
                    name='name'
                    label='Nome do componente'
                    placeholder='Nome do componente'
                    style={{ marginBottom: 8 }}
                />
                <CustomButton
                    title='Cadastrar'
                    style={{ marginBottom: 8 }}
                    onPress={() => formRef.current.submitForm()}
                />
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
            <CustomButton title='Adicionar novo Componente Alergênico' onPress={() => setCreateModalActive(true)} />
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
                    if (isLoading) fetchComponents(source.token);
                }}
            />
        </View>
    );
};

export default ListAlergenicComponent;
