import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';
import { API_ENDPOINTS } from '../utils/constants';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null,
        token: null,
        loading: false,
        error: null 
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage if available
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const [state, dispatch] = useReducer(authReducer, {
    ...initialState,
    token: storedToken || null,
    user: storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken && !!storedUser,
    loading: true
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user && user !== 'undefined') {
        // Set state immediately from localStorage
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: JSON.parse(user),
            token
          }
        });
        // Revalidate profile in background
        try {
          const response = await authService.getProfile();
          const freshUser = response.data.user;
          if (freshUser) {
            localStorage.setItem('user', JSON.stringify(freshUser));
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: freshUser,
                token
              }
            });
          }
        } catch (error) {
          // Only log out if error is 401 Unauthorized (invalid token)
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'LOGOUT' });
          } else {
            // For other errors (e.g., network), do not log out
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } else {
        localStorage.removeItem('user'); // Ensure no undefined/null user is left
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      return { success: true };
    } catch (error) {
      localStorage.removeItem('user');
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.register(userData);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      return { success: true };
    } catch (error) {
      localStorage.removeItem('user');
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};