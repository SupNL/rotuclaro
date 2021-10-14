import React from 'react';
import { ActivityIndicator } from 'react-native';
import COLORS from 'shared/COLORS';

const LoadingCircle = () => {
    return (
        <ActivityIndicator
            style={{ marginVertical: 8 }}
            color={COLORS.secondary}
        />
    );
};

export default LoadingCircle;
