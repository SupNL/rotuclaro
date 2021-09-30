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
import { Perfil } from 'model/Perfil';

const AuthContext = createContext({});

const AuthProvider = ({ children, navRef }) => {
    const tokenAddr = '@rotuclaro:token';
    const userAddr = '@rotuclaro:user';
    const profileAddr = '@rotuclaro:profile';

    const [data, setData] = useState({
        token: null,
        usuario: null,
        perfil: null,
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
                    usuario: parsedUser,
                    perfil: parsedProfile
                        ? new Perfil(parsedProfile)
                        : parsedProfile,
                });
            } else {
                setData({
                    token: null,
                    usuario: {
                        unauthenticated: true,
                    },
                    perfil: null,
                });
            }
        }
        initializeAuth();
    }, []);

    useEffect(() => {
        if (data.token) {
            console.log('[AuthHook] Checking Session with available token');
            api.get('/sessao').catch(() => {
                console.log('[AuthHook] Session expired');
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
        delete usuario.perfil;

        await AsyncStorage.setItem(tokenAddr, token);
        await AsyncStorage.setItem(userAddr, JSON.stringify(usuario));
        await AsyncStorage.setItem(profileAddr, JSON.stringify(perfil));

        api.defaults.headers.authorization = `Bearer ${token}`;

        const perfilInstanciado = perfil ? new Perfil(perfil) : undefined;

        const objectRes = { token, usuario, perfil: perfilInstanciado };
        setData({ token, usuario, perfil: perfilInstanciado });
        return objectRes;
    }, []);

    const signOut = useCallback(async () => {
        console.log('[AuthHook] Signing out');

        await AsyncStorage.removeItem(tokenAddr);
        await AsyncStorage.removeItem(userAddr);
        await AsyncStorage.removeItem(profileAddr);
        api.defaults.headers.authorization = null;
        setData({
            token: null,
            usuario: {
                unauthenticated: true,
            },
            perfil: null,
        });

        if (navRef.current) navReplace('LoginNav');
    }, []);

    const updateProfile = useCallback(async (profile) => {
        await AsyncStorage.setItem(profileAddr, JSON.stringify(profile));
        setData((old) => ({ ...old, perfil: new Perfil(profile) }));
    });

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                updateProfile,
                usuario: data.usuario,
                perfil: data.perfil,
            }}
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
