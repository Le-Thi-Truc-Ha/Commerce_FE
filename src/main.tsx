import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./main.scss"; 
import "./variables.scss";
import { UserProvider } from './configs/globalVariable.tsx';
import 'react-photo-view/dist/react-photo-view.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  // </StrictMode>,
)