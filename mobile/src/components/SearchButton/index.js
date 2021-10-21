import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Search } from 'react-native-feather';
import COLORS from 'shared/COLORS';

const SearchButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Search stroke={COLORS.black} width={24} height={28} />
        </TouchableOpacity>
    );
};

export default SearchButton;
