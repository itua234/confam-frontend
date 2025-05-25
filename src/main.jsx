import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../global.css'
import 'tailwindcss/tailwind.css'
import App from './App.jsx'

import '@rainbow-me/rainbowkit/styles.css';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="wide">
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
)
