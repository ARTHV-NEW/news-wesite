import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import AdminApp from './AdminApp.tsx';
import './index.css';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { seedDatabaseIfEmpty } from './services/db';

// Run database seeding on startup
seedDatabaseIfEmpty();

const isAdmin = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {isAdmin ? <AdminApp /> : <App />}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

