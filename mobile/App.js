import React from 'react';
import MainNavigation from 'navigation/MainNavigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    return (
        <MainNavigation>
            <StatusBar style='auto' />
        </MainNavigation>
    );
}
