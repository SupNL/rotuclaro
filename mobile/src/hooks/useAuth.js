import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from 'services/api';
import { StackActions } from '@react-navigation/native';

const AuthContext = createContext({});

const AuthProvider = ({ children, navRef }) => {
    const tokenAddr = '@rotuclaro:token';
    const userAddr = '@rotuclaro:user';

    const [data, setData] = useState({ user: null, token: null });

    const navReplace = (name) => {
        navRef.current.dispatch(StackActions.replace(name));
    };

    useEffect(() => {
        async function initializeAuth() {
            console.log('[AuthHook] Initializing on useEffect');
            const token = await AsyncStorage.getItem(tokenAddr);
            const user = await AsyncStorage.getItem(userAddr);

            if (token && user) {
                const parsedUser = JSON.parse(user);
                console.log(
                    `[AuthHook] User ${parsedUser.nome} is authenticated`
                );
                api.defaults.headers.authorization = `Bearer ${token}`;

                setData({
                    token,
                    user: parsedUser,
                });
            } else {
                setData({
                    user: {
                        unauthenticated: true,
                    },
                    token: null,
                });
            }
        }
        initializeAuth();
    }, []);

    useEffect(() => {
        console.log('[AuthHook] Checking Session');

        if (data.token) {
            api.get('/sessao').catch(() => {
                console.log('[AuthHook] Session expired');
                navReplace('LoginNav');
                signOut();
            });
        }
    }, [data.token, signOut]);

    const signIn = useCallback(async (username, password) => {
        console.log('[AuthHook] Signing in');

        const res = await api.post('/sessao', {
            login: username,
            senha: password,
        });

        const { token, usuario } = res.data;

        await AsyncStorage.setItem(tokenAddr, token);
        await AsyncStorage.setItem(userAddr, JSON.stringify(usuario));

        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, user: usuario });
        return { token, usuario };
    }, []);

    const signOut = useCallback(async () => {
        console.log('[AuthHook] Signing out');

        await AsyncStorage.removeItem('@rotuclaro:token');
        await AsyncStorage.removeItem('@rotuclaro:user');
        api.defaults.headers.authorization = null;
        setData({
            user: {
                unauthenticated: true,
            },
            token: null,
        });
    }, []);

    return (
        <AuthContext.Provider value={{ signIn, signOut, user: data.user }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth };
