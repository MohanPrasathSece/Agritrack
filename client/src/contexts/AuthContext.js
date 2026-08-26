import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  showLocationDetection: false
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // Ensure address is always a string, not an object - aggressive fallback
      let addressString = 'Regional Node';
      const isLocationDetected = Boolean(
        action.payload?.address &&
        typeof action.payload.address === 'object' &&
        action.payload.address?.isLocationDetected
      );
      if (action.payload?.address) {
        if (typeof action.payload.address === 'string') {
          addressString = action.payload.address;
        } else if (typeof action.payload.address === 'object') {
          addressString = action.payload.address?.fullAddress || 
                         action.payload.address?.full_address || 
                         `${action.payload.address?.village || ''}, ${action.payload.address?.district || ''}, ${action.payload.address?.state || ''}`.replace(/^[,\s]+|[,\s]+$/g, '') || 
                         'Regional Node';
        }
      }
      
      const sanitizedPayload = {
        ...action.payload,
        address: addressString
      };
      const shouldShowLocation = sanitizedPayload.role === 'farmer' && !isLocationDetected;
      return {
        ...state,
        user: sanitizedPayload,
        isAuthenticated: true,
        loading: false,
        error: null,
        showLocationDetection: shouldShowLocation
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        showLocationDetection: false
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'HIDE_LOCATION_DETECTION':
      return {
        ...state,
        showLocationDetection: false
      };
    case 'UPDATE_USER_LOCATION':
      // Ensure location is stored as string, not object
      const locationString = typeof action.payload === 'object' ? 
        (action.payload?.fullAddress || action.payload?.full_address || 'Regional Node') : 
        (action.payload || 'Regional Node');
      return {
        ...state,
        user: { ...state.user, address: locationString },
        showLocationDetection: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isFetchingProfile = useRef(null);

  // Clear any cached data with address objects on mount to prevent React rendering errors
  useEffect(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('agritrack_profile_')) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (typeof parsed?.address === 'object' && parsed?.address !== null) {
              localStorage.removeItem(key);
              console.log('🧹 Cleared cached profile with address object:', key);
            }
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });
  }, []);
  const isMounted = useRef(true);

  const fetchUserProfile = async (userId, event) => {
    if (isFetchingProfile.current === userId) return;

    // Check if we already have this user loaded to avoid flicker
    if (state.user?.id === userId && (event === 'INITIAL_SESSION' || !event)) {
      console.log('⚡ AuthContext: Profile active');
      return;
    }

    isFetchingProfile.current = userId;

    try {
      console.log(`🔍 AuthContext: Syncing profile for ${userId}...`);

      // Load from cache immediately if not in state
      if (!state.user) {
        const cached = localStorage.getItem(`agritrack_profile_${userId}`);
        if (cached) {
          try {
            const parsedCached = JSON.parse(cached);
            // Clear cache if it contains address objects to prevent rendering errors
            if (typeof parsedCached?.address === 'object' && parsedCached?.address !== null) {
              localStorage.removeItem(`agritrack_profile_${userId}`);
              console.log('🧹 Cleared cached profile with address object');
            } else {
              dispatch({ type: 'LOGIN_SUCCESS', payload: parsedCached });
            }
          } catch (e) { 
            // Clear corrupted cache
            localStorage.removeItem(`agritrack_profile_${userId}`);
          }
        }
      }

      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (!isMounted.current) return;

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile genuinely doesn't exist — create one for first-time users
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser && isMounted.current) {
            // Double-check profile doesn't exist (avoid duplicates from race conditions)
            const { data: doubleCheck } = await supabase
              .from('profiles')
              .select('*').eq('id', userId).maybeSingle();
            if (doubleCheck) {
              // Found on second check, use it
              const sanitizedDoubleCheck = {
                ...doubleCheck,
                address: typeof doubleCheck?.address === 'object' ? 
                  (doubleCheck?.address?.fullAddress || doubleCheck?.address?.full_address || 'Regional Node') : 
                  (doubleCheck?.address || 'Regional Node')
              };
              localStorage.setItem(`agritrack_profile_${userId}`, JSON.stringify(sanitizedDoubleCheck));
              dispatch({ type: 'LOGIN_SUCCESS', payload: sanitizedDoubleCheck });
            } else {
              // Truly new user
              const newProfile = {
                id: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
                created_at: new Date().toISOString()
              };
              const { data: created, error: createErr } = await supabase.from('profiles').insert([newProfile]).select().single();
              if (created && isMounted.current) {
                localStorage.setItem('agritrack_new_user', 'true');
                const sanitizedCreated = {
                  ...created,
                  address: typeof created?.address === 'object' ? 
                    (created?.address?.fullAddress || created?.address?.full_address || 'Regional Node') : 
                    (created?.address || 'Regional Node')
                };
                localStorage.setItem(`agritrack_profile_${userId}`, JSON.stringify(sanitizedCreated));
                dispatch({ type: 'LOGIN_SUCCESS', payload: sanitizedCreated });
              } else if (createErr) {
                console.error('❌ Profile creation error:', createErr);
                if (isMounted.current) dispatch({ type: 'SET_LOADING', payload: false });
              }
            }
          }
        } else {
          // Other Supabase error (network, auth, RLS, etc.)
          console.error('❌ Profile fetch error:', error.message, '| Code:', error.code);
          // Fall back to cache if available
          const cached = localStorage.getItem(`agritrack_profile_${userId}`);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (isMounted.current) dispatch({ type: 'LOGIN_SUCCESS', payload: parsed });
            } catch (e) {
              if (isMounted.current) dispatch({ type: 'SET_LOADING', payload: false });
            }
          } else {
            if (isMounted.current) dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } else if (data) {
        // Sanitize data before storing and dispatching to prevent React rendering errors
        const sanitizedData = {
          ...data,
          address: typeof data?.address === 'object' ? 
            (data?.address?.fullAddress || data?.address?.full_address || 'Regional Node') : 
            (data?.address || 'Regional Node')
        };
        localStorage.setItem(`agritrack_profile_${userId}`, JSON.stringify(sanitizedData));
        dispatch({ type: 'LOGIN_SUCCESS', payload: sanitizedData });
      }
    } catch (err) {
      console.error('❌ Sync Error:', err);
      if (isMounted.current) dispatch({ type: 'SET_LOADING', payload: false });
    } finally {
      isFetchingProfile.current = null;
    }
  };

  useEffect(() => {
    isMounted.current = true;

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isMounted.current) {
        fetchUserProfile(session.user.id, 'INITIAL_SESSION');
      } else if (isMounted.current) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem(`agritrack_profile_${session.user.id}`);
          dispatch({ type: 'LOGOUT' });
        } else {
          fetchUserProfile(session.user.id, event);
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const apiUrl = process.env.REACT_APP_API_URL || '/api/v1';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      await supabase.auth.setSession(result.session);
      return { success: true };
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) dispatch({ type: 'AUTH_ERROR', payload: error.message });
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const apiUrl = process.env.REACT_APP_API_URL || '/api/v1';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      if (result.session) await supabase.auth.setSession(result.session);
      return { success: true };
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = () => supabase.auth.signOut();

  const updateUserRole = async (role) => {
    if (!state.user) return { success: false };
    const { error } = await supabase.from('profiles').update({ role }).eq('id', state.user.id);
    if (!error) {
      const updated = { ...state.user, role };
      localStorage.setItem(`agritrack_profile_${state.user.id}`, JSON.stringify(updated));
      dispatch({ type: 'LOGIN_SUCCESS', payload: updated });
      return { success: true };
    }
    return { success: false, error: error.message };
  };

  const value = {
    ...state,
    login, register, logout, signInWithGoogle,
    updateUserRole,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    updateUserLocation: async (loc) => {
      await supabase.from('profiles').update({ address: loc }).eq('id', state.user.id);
      dispatch({ type: 'UPDATE_USER_LOCATION', payload: loc });
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
