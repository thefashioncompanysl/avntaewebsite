import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { DesignersProvider } from './context/DesignersContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DesignersProvider>
        <App />
      </DesignersProvider>
    </BrowserRouter>
  </StrictMode>,
);
