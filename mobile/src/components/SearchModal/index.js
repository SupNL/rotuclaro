import React from 'react';
import { Form } from '@unform/mobile';
import CustomButton from 'components/CustomButton';
import CustomModal from 'components/CustomModal';
import Input from 'components/Input';
import { useRef } from 'react';

const SearchModal = ({ label, setInfo, visible, setVisible, toggleSearch }) => {
    const formRef = useRef();

    return (
        <CustomModal visible={visible} onRequestClose={() => setVisible(false)}>
            <Form
                ref={formRef}
                onSubmit={(data) => {
                    const toSearch = data['to-search'];
                    if (toSearch == null || toSearch === '') {
                        setInfo(undefined);
                    } else {
                        setInfo(toSearch);
                    }
                    toggleSearch(true);
                    setVisible(false);
                }}
            >
                <Input
                    label={label}
                    name='to-search'
                    style={{ marginBottom: 8 }}
                />
                <CustomButton
                    title={'Pesquisar'}
                    onPress={() => formRef.current.submitForm()}
                />
            </Form>
        </CustomModal>
    );
};

export default SearchModal;
