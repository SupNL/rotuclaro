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
    const profileAddr = '@rotuclaro:profile';

    const [data, setData] = useState({
        user: null,
        token: null,
        profile: null,
    });

    const navReplace = (name) => {
        navRef.current.dispatch(StackActions.replace(name));
    };

    useEffect(() => {
        async function initializeAuth() {
            console.log('[AuthHook] Initializing on useEffect');
            const token = await AsyncStorage.getItem(tokenAddr);
            const user = await AsyncStorage.getItem(userAddr);
            const profile = await AsyncStorage.getItem(profileAddr);

            if (token && user) {
                const parsedUser = JSON.parse(user);
                const parsedProfile = JSON.parse(profile);
                console.log(
                    `[AuthHook] User ${parsedUser.nome} is authenticated`
                );
                api.defaults.headers.authorization = `Bearer ${token}`;

                setData({
                    token,
                    user: parsedUser,
                    profile: parsedProfile,
                });
            } else {
                setData({
                    user: {
                        unauthenticated: true,
                    },
                    token: null,
                    profile: null,
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

        const perfil = usuario.perfil;
        delete usuario.perifl;

        await AsyncStorage.setItem(tokenAddr, token);
        await AsyncStorage.setItem(userAddr, JSON.stringify(usuario));
        await AsyncStorage.setItem(profileAddr, JSON.stringify(perfil));

        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, user: usuario, profile: perfil });
        return { token, usuario, perfil };
    }, []);

    const signOut = useCallback(async () => {
        console.log('[AuthHook] Signing out');

        await AsyncStorage.removeItem(tokenAddr);
        await AsyncStorage.removeItem(userAddr);
        await AsyncStorage.removeItem(profileAddr);
        api.defaults.headers.authorization = null;
        setData({
            user: {
                unauthenticated: true,
            },
            token: null,
            profile: null,
        });

        if (navRef.current) navReplace('LoginNav');
    }, []);

    const updateProfile = useCallback(async (profile) => {
        await AsyncStorage.setItem(profileAddr, JSON.stringify(profile));
        setData((old) => ({ ...old, profile: profile }));
    });

    return (
        <AuthContext.Provider
            value={{ signIn, signOut, updateProfile, user: data.user, profile: data.profile }}
        >
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth };
