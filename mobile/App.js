import React from 'react';
import MainNavigation from 'navigation/MainNavigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    // eslint-disable-next-line no-undef
    if (!__DEV__) {
        console.log = () => {};
        console.error = () => {};
    }

    return (
        <MainNavigation>
            <StatusBar style='auto' />
        </MainNavigation>
    );
}
