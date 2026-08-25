import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { initLocale } from './i18n';
import './index.css';

/*
  Read `?lang=` before the first render rather than inside a component. The
  locale is module state, not React state, so a component reading it during its
  own first render would read the default and then never re-read it.
*/
initLocale();

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
