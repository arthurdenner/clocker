import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { firebase, persistenceMode } from './../../config/firebase/client';

const AuthContext = createContext(null);

export const logout = () => firebase.auth().signOut();

export const login = async ({ email, password }) => {
  firebase.auth().setPersistence(persistenceMode);

  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    return firebase.auth().currentUser;
  } catch (error) {
    console.log('LOGIN ERROR:', error);
  }
};

export const signup = async ({ email, password, username }) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = await login({ email, password });
    const token = await user.getIdToken();

    const { data } = await axios({
      method: 'post',
      url: '/api/profile',
      data: { username },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(data);
  } catch (error) {
    console.log('SIGNUP ERROR:', error);
  }
};

export const useAuth = () => {
  const auth = useContext(AuthContext);

  return [auth, { login, logout, signup }];
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user,
      });
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
