import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../global.css'
import 'tailwindcss/tailwind.css'
import App from './App.jsx'
//import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { store } from './reducers/store';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route path="/:kyc_token" element={<App />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)