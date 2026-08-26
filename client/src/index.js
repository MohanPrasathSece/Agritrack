import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';

// Suppress AbortError from Supabase gotrue-js internal fetches.
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.name === 'AbortError' ||
    event.reason?.message?.includes('aborted') ||
    event.reason?.message?.includes('signal is aborted')
  ) {
    event.preventDefault();
  }
});

// Some aborts surface as window "error" events in dev overlay.
window.addEventListener('error', (event) => {
  const msg = event?.message || event?.error?.message;
  const name = event?.error?.name;

  if (
    name === 'AbortError' ||
    msg?.includes('AbortError') ||
    msg?.includes('signal is aborted') ||
    msg?.includes('aborted without reason')
  ) {
    event.preventDefault();
  }
});

// Last resort: filter AbortError from console.error to stop overlay noise
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0]?.message || args[0] || '';
  if (
    typeof message === 'string' &&
    (message.includes('AbortError') ||
     message.includes('signal is aborted') ||
     message.includes('aborted without reason'))
  ) {
    // Silently ignore AbortError messages
    return;
  }
  originalConsoleError.apply(console, args);
};

// Additional: Override console.warn to catch AbortError warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0]?.message || args[0] || '';
  if (
    typeof message === 'string' &&
    (message.includes('AbortError') ||
     message.includes('signal is aborted') ||
     message.includes('aborted without reason'))
  ) {
    // Silently ignore AbortError warnings
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Catch any uncaught exceptions that might be AbortError
const originalHandler = window.onerror;
window.onerror = function(message, source, lineno, colno, error) {
  if (
    error?.name === 'AbortError' ||
    message?.includes('AbortError') ||
    message?.includes('signal is aborted') ||
    message?.includes('aborted without reason')
  ) {
    return true; // Prevent default error handling
  }
  if (originalHandler) {
    return originalHandler.call(this, message, source, lineno, colno, error);
  }
  return false;
};


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Web3Provider>
            <App />
          </Web3Provider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
