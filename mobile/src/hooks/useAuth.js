import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api, { uninterceptedApi } from 'services/api';
import { StackActions } from '@react-navigation/native';
import { Perfil } from 'model/Perfil';
import ShowToast from 'utils/ShowToast';

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
                uninterceptedApi.defaults.headers.authorization = `Bearer ${token}`;

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
            uninterceptedApi.get('/sessao').catch((err) => {
                if (err.response) {
                    if (err.response.status === 401) {
                        console.log('[AuthHook] Session expired');
                        ShowToast('Sessão expirada.');
                        signOut();
                    } else {
                        console.log('[AuthHook] An unexpected error happened');
                        console.log(err.response.data);
                    }
                } else {
                    console.log('[AuthHook] Server has no response');
                }
            });
        }
    }, [data.token]);

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
        uninterceptedApi.defaults.headers.authorization = `Bearer ${token}`;

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
        delete api.defaults.headers.authorization;
        delete uninterceptedApi.defaults.headers.authorization;
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

    const updateUserData = useCallback(async (nome, login) => {
        setData((oldData) => {
            const oldUser = oldData.usuario;
            return {
                ...oldData,
                usuario: {
                    ...oldUser,
                    nome,
                    login,
                },
            };
        });
    });

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                updateProfile,
                updateUserData,
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
